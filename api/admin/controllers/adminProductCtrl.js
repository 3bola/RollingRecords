"use strict";
//Variables as Const
const mongoose 		= require('mongoose');
const Product 		= require('../../../models/product');
const paginate 		= require('../middleware/paginate');
const multer 		= require("multer");
const cloudinary 	= require('cloudinary');
const fs 			= require('fs');
const fileType 		= require('file-type');
const readChunk		= require('read-chunk');
const jimp			= require('jimp');
//Add product
//Variables to hold temporary data to create product
let cropperData;
let featuredImg;
let featuredMinImg;
//Helper functions
function capitalizeFirstLetter(string) {
	if(string !== "") {
		return string.trim().charAt(0).toUpperCase() + string.slice(1);
	} else {
		return "";
	}
};
function _splitArray(input){
	var output;
	if(input && input.length > 0) {
		output = input.split(",");
	} else {
		output = [];
	}
	return output;
};
function getTotalQuantity (stores) {
	let quntities = stores.map((store) => {
    return store.quantity;
  });
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  var total_quantity_value = quntities.reduce(reducer);
  return total_quantity_value;
};
//Setup multer
//Create new file-Upload System
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/images/uploads');
  },
  filename: function (req, file, callback) {
  	var fileExtension = file.originalname.split('.')[1];
  	featuredImg = req.user.username.toLowerCase()+Date.now()+'.'+fileExtension;
    callback(null, featuredImg);
  }
});
var upload = multer({ storage : storage}).single('image');
//Configure cloudinary
cloudinary.config({
	cloud_name: "romantuomisto-com",
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET
});
//Get cropper Data, presave it into variable
module.exports.setCropperData = (req, res, next) => {
	/***** GRAB DATA FROM AJAX *****/
	cropperData = req.body;
	if(cropperData !== undefined) {
		res.send('success');
	} else {
		res.send("error");
	}
};
module.exports.getAddProductForm = (req, res, next) => {
	res.render("admin/product/addproduct.ejs");
};
module.exports.checkProductsName = (req, res, next) => {
	Product.findOne({name: req.body.name, title: req.body.title}).where("category").equals(req.body.category).exec((err, foundProduct) => {
		if(err) {
			req.flash("error", err.message);
			return res.redirect("back");
		} else if(!foundProduct) {
			res.send("success");
		} else {
			console.log(foundProduct);
			res.send("taken");
		}
	});
};
module.exports.addProduct = (req, res, next) => {
	upload(req, res, (err) => {
		if(err) {
			req.flash("error", err.message);
			res.redirect('back');
			return;
		} else {
			if(req.file) {
				const buffer = readChunk.sync(`./public/images/uploads/${featuredImg}`, 0, 4100);
				if(fileType(buffer) && fileType(buffer).mime === "image/png" || fileType(buffer).mime === "image/jpg" || fileType(buffer).mime === "image/jpeg" || fileType(buffer).mime === "image/bmp") {
					jimp.read(`./public/images/uploads/${featuredImg}`, (err, lenna)=> {
						if(err) {
							req.flash("error", err.message);
							res.redirect('back');
							return;
						} else {
							if(lenna.bitmap.width > 298 && lenna.bitmap.height > 298) {
								var x = Number(cropperData.x);
								var y = Number(cropperData.y);
								var width = Number(cropperData.width);
								var height = Number(cropperData.height);
								var rotate = Number(cropperData.rotate);
								var scaleX = Number(cropperData.scaleX);
								var scaleY = Number(cropperData.scaleY);
								lenna.rotate(rotate).scale(scaleX).crop(x, y, width, height).quality(60)
								.resize(576, 576).write(`./public/images/cropped-images/${featuredImg}`, (err, croppedImg) => {
									if(err) {
										req.flash("error", err.message);
										res.redirect('back');
										return;
									} else {
										cloudinary.uploader.upload(`./public/images/cropped-images/${featuredImg}`, (result) => { 
											if(result) {
												let storeObj = {
													quantity: req.body.quantity,
													location: req.body.location
												};
												let product = new Product();
												if(req.body.category === "Oheistarvikkeet") {
													product.type = "muut";
												} else {
													product.type = "lp";
												}
												product.unit_type = "physical";
												product.title = capitalizeFirstLetter(req.body.title || req.body.title2);
												product.category = capitalizeFirstLetter(req.body.category);
												product.genre = capitalizeFirstLetter(req.body.genre || "oheistarvikkeet");
												product.label = req.body.label;
												product.year = Number(req.body.year);
												product.releasedate = req.body.releasedate;
												product.stores.push(storeObj);
												product.total_quantity = req.body.quantity;
												product.edition = req.body.edition;
												product.ean = req.body.ean;
												product.reference = req.body.reference;
												product.image_uri = result.secure_url;
												product.description = req.body.description;
												product.additional_info = req.body.additional_info;
												product.conditionDisk = req.body.conditionDisk;
												product.conditionCovers = req.body.conditionCovers;
												product.cover = result.secure_url;
												product.cover_id = result.public_id;
												product.name = capitalizeFirstLetter(req.body.name);
												product.unit_price = Number(req.body.unit_price);
												let tax = ((parseInt(req.body.unit_price) * (parseFloat(req.body.vat).toFixed(2) * 100)) / 100);
  												product.tax = tax;
  												product.unit_price_excluding_tax = (parseInt(req.body.unit_price) - tax).toFixed(2); 
												product.discountedPrice = req.body.discountedPrice;
												product.vat = Number(req.body.vat);
												product.tracklist = _splitArray(req.body.tracklist);
												product.fullname = capitalizeFirstLetter(req.body.title) + " " + capitalizeFirstLetter(req.body.name);
												product.save((err, newProduct) => {
													if(err) {
														req.flash("error", err.message);
														res.redirect('back');
														return;
													} else {
														newProduct.uri = "https://rollingrecords.fi/"+newProduct._id+"/show";
														newProduct.save();
														req.flash("success", `Onnistui, tuote ${product.title} - ${product.name} on onnistuneesti luotu tietokantaan.`);
														res.redirect("back");
														return;
													}
												});
											} else {
												req.flash("error", "Lataus cloudinary pilvipalveluun epäonnistui.");
												res.redirect('back');
												return;
											}
										});
									}
								});
							} else {
								req.flash("error", "uvatiedoston leveys ja korkeus on oltava vähintään 300px.");
								res.redirect('back');
								return;
							}
						}
					});
				} else {
					req.flash("error", "Vain jpg, png, bmp ja jpeg kuvatiedostot ovat sallittuja.");
					res.redirect('back');
					return;
				}
			} else {
				req.flash("error", "Valitkaa kuvatiedosto jatkaaksenne tuotteen luomista.");
				res.redirect("back");
				return;
			}
		}
	});
};
//Edit product
module.exports.listProducts = (req, res, next) => {
	paginate.paginateItems(req, res, Product, (err, output) => {
		if(err) {
			req.flash("error", "Ups! Valitettavasti jotain meni pieleen.");
			return res.redirect("/admin");
		} else {
			res.render("admin/product/productlist.ejs", {
				products: output.products,
				pages: output.pages,
				items: output.items,
				genre: output.genre,
				category: output.category,
				title: output.title,
				Quantity: output.Quantity,
				search: output.search
			});
		}
	});
};
module.exports.getEditForm = (req, res, next) => {
	Product.findById(req.params.id, (err, foundProduct) => {
		if(err || !foundProduct) {
			req.flash("error", "Ups! Valitettavasti jokin meni pieleen tuotetta haettaessa!");
			return res.redirect("back");
		} else {
			res.render("admin/product/editproduct.ejs", {
				product: foundProduct
			});
		}
	});
};
module.exports.editProduct = (req, res, next) => {
	Product.findById(req.params.id, function(err, foundProduct) {
		if(err) {
			req.flash("error", "Ups! Valitettavasti jokin meni pieleen tuotetta haettaessa!");
			return res.redirect("back");
		} else {
			let tax = ((parseInt(req.body.unit_price) * (parseFloat(req.body.vat).toFixed(2) * 100)) / 100);
  			foundProduct.tax = tax;
  			foundProduct.ean = req.body.ean;
  			foundProduct.unit_price_excluding_tax = (parseInt(req.body.unit_price) - tax).toFixed(2); 
			foundProduct.name = capitalizeFirstLetter(req.body.name);
			foundProduct.title = capitalizeFirstLetter(req.body.title);
			foundProduct.category = req.body.category;
			foundProduct.genre = capitalizeFirstLetter(req.body.genre);
			foundProduct.year = req.body.year;
			foundProduct.label = req.body.label;
			foundProduct.uri = "https://rollingrecords.fi/product/"+foundProduct._id+"/show";
			foundProduct.edition = req.body.edition;
			foundProduct.conditionDisk = req.body.conditionDisk;
			foundProduct.conditionCovers = req.body.conditionCovers;
			foundProduct.unit_price = req.body.unit_price;
			foundProduct.discountedPrice = req.body.discountedPrice;
			foundProduct.vat = req.body.vat;
			foundProduct.releasedate = req.body.category !== "Tulevat" ? null : req.body.releasedate;
			foundProduct.description = req.body.description;
			foundProduct.additional_info = req.body.additional_info;
			foundProduct.fullname = capitalizeFirstLetter(req.body.title) + " " + capitalizeFirstLetter(req.body.name);
			foundProduct.save((err, updatedProduct) => {
				if(err) {
					req.flash("error", err.message);
					return res.redirect("back");
				} else {
					req.flash("success", "Tuotteen " +foundProduct.name+" - "+foundProduct.title+" tietoja on onnituneesti päivitetty.");
					res.redirect("back");
				}
			});
		}
	});
};
module.exports.setStoreInfo = (req, res, next) => {
	Product.findById(req.params.id, (err, foundProduct) => {
		if(err || !foundProduct) {
			req.flash("error", err.message);
			return res.redirect("back");
		} else {
			if(req.body.store_id) {
				foundProduct.stores.pull({_id: req.body.store_id});
				let newStoreInfo = {};
				newStoreInfo.location = req.body.location;
				newStoreInfo.quantity = req.body.quantity;
				foundProduct.stores.unshift(newStoreInfo);
				foundProduct.total_quantity = getTotalQuantity(foundProduct.stores);
				foundProduct.save((err, updated) => {
					if(err) {
						req.flash("error", err.message);
						return res.redirect("back");
					} else {
						req.flash("success", "Määrä ja paikka tietoja on päivitetty onnistuneesti.");
						return res.redirect("back");
					}
				});
			} else {
				let storeObj = {};
				storeObj.location = req.body.location;
				storeObj.quantity = req.body.quantity;
				foundProduct.stores.push(storeObj);
				foundProduct.total_quantity = getTotalQuantity(foundProduct.stores);
				foundProduct.save((err, updated) => {
					if(err) {
						req.flash("error", err.message);
						return res.redirect("back");
					} else {
						req.flash("success", "Määrä ja paikka tietoja on lisätty onnistuneesti.");
						return res.redirect("back");
					}
				});
			}
		}
	});
};
module.exports.editTracklist = (req, res, next) => {
	Product.findById(req.params.id, (err, foundProduct) => {
		if(err || !foundProduct) {
			req.flash("error", err.message);
			return res.redirect("back");
		} else {
			if(!foundProduct.tracklist.length) {
				foundProduct.tracklist = _splitArray(req.body.tracklist);
				foundProduct.save((err, updated) => {
					if(err) {
						req.flash("error", err.message);
						return res.redirect("back");
					} else {
						req.flash("success", "Kappaleluettelo on luotu.");
						res.redirect("/admin/product/"+foundProduct._id+"/edit");
						return;
					}
				});
			} else if(req.body.track_name_edit) {
				var trackIndex = foundProduct.tracklist.indexOf(req.body.track_name_for_index);
				foundProduct.tracklist.splice(trackIndex, 1);
				foundProduct.tracklist.splice(trackIndex, 0, req.body.track_name_edit);
				foundProduct.save((err, updatedPro) => {
					if(err) {
						req.flash("error", err.message);
						return res.redirect("back");
					} else {
						req.flash("success", "Kappaletta on muokattu.");
						res.redirect("/admin/product/"+foundProduct._id+"/edit");
					}
				});
			} else {
				var trackIndex = foundProduct.tracklist.indexOf(req.body.track_name);
				foundProduct.tracklist.splice(trackIndex, 1);
				foundProduct.save((err, updatedPro) => {
					if(err) {
						req.flash("error", err.message);
						return res.redirect("back");
					} else {
						req.flash("success", "Kappale on poistettu.");
						res.redirect("/admin/product/"+foundProduct._id+"/edit");
					}
				});
			}
		}
	});
};
module.exports.archiveProduct = (req, res, next) => {
	Product.findById(req.params.id, function(err, foundProduct) {
		if(err || !foundProduct) {
			req.flash("error", err.message);
			return res.redirect("back");
		} else {
			if(foundProduct.status === "archived") {
				foundProduct.status = "available";
				foundProduct.save((err, done) => {
					if(err) {
						req.flash("error", err.message);
						return res.redirect("back");
					} else {
						req.flash("success", "Tuote on onnistuneesti palautettu kaupan myyntilistoille.");
						res.redirect("/admin/product");
						return;
					}
				});
			} else {
				foundProduct.status = "archived";
				foundProduct.save((err, done) => {
					if(err) {
						req.flash("error", err.message);
						return res.redirect("back");
					} else {
						req.flash("success", "Tuote on onnistuneesti arkistoitu. Jatkossa se ei tule näkymään verkkokaupassa myyntilistoilla, ainoastaan asiakkaiden ostohistoriassa.");
						res.redirect("/admin/product");
					}
				});
			}
		}
	});
};
//update cover image
module.exports.updateCoverImage = (req, res, next) => {
	Product.findById(req.params.id, (err, foundProduct) => {
		if(err || !foundProduct) {
			req.flash("error", err.message);
			return res.redirect("back");
		} else {
			upload(req, res, (err) => {
				if(err) {
					req.flash("error", err.message);
					return res.redirect("/admin/product/"+foundProduct._id+"/edit");
				} else {
					if(req.file) {
						cloudinary.uploader.destroy(foundProduct.cover_id, (result) => {
							if(result.result !== "not found") {
								const buffer = readChunk.sync(`./public/images/uploads/${featuredImg}`, 0, 4100);
								if(fileType(buffer) && fileType(buffer).mime === "image/png" || fileType(buffer).mime === "image/jpg" || fileType(buffer).mime === "image/jpeg" || fileType(buffer).mime === "image/bmp") {
									jimp.read(`./public/images/uploads/${featuredImg}`, (err, lenna) => {
										if(err) {
											req.flash("error", err.message);
											res.redirect("/admin/product/"+foundProduct._id+"/edit");
											return;
										} else {
											if(lenna.bitmap.width > 298 && lenna.bitmap.height > 298) {
												var x = Number(cropperData.x);
												var y = Number(cropperData.y);
												var width = Number(cropperData.width);
												var height = Number(cropperData.height);
												var rotate = Number(cropperData.rotate);
												var scaleX = Number(cropperData.scaleX);
												var scaleY = Number(cropperData.scaleY);
												lenna.rotate(rotate).scale(scaleX).crop(x, y, width, height).quality(60)
												.resize(576, 576).write(`./public/images/cropped-images/${featuredImg}`, (err, croppedImg) => {
													if(err) {
														req.flash("error", err.message);
														res.redirect("/admin/product/"+foundProduct._id+"/edit");
														return;
													} else {
														cloudinary.uploader.upload(`./public/images/cropped-images/${featuredImg}`, (result) => { 
															if(result.public_id) {
																foundProduct.cover_id = result.public_id;
																foundProduct.cover = result.secure_url;
																foundProduct.image_url = result.secure_url;
																foundProduct.save((err, updated) => {
																	if(err) {
																		req.flash('error', err.message);
																		return res.redirect("back");
																	} else {
																		req.flash("success", "Tuotteen "+foundProduct.title+" "+foundProduct.name+" kansikuva on päivitetty.");
																		return res.redirect("/admin/product/"+foundProduct._id+"/edit");
																	}
																});
															} else {
																req.flash("error", "Lataus cloudinary pilvipalveluun epäonnistui.");
																res.redirect("/admin/product/"+foundProduct._id+"/edit");
																return;
															}
														});
													}	
												});
											} else {
												req.flash("error", "Kuvatiedoston leveys ja korkeus on oltava vähintään 300px.");
												res.redirect("back");
												return;
											}
										}
									});
								} else {
									req.flash("error", "Vain jpg, png, bmp ja jpeg kuvatiedostot ovat sallittuja.");
									res.redirect('back');
									return;
								}
							} else {
								req.flash("error", "Kuvan poistaminen cloudinary palvelusta epäonnistui.");
								res.redirect("/admin/product/"+foundProduct._id+"/edit");
								return;
							}
						});
					} else {
						req.flash("error", "Valitkaa kuvatiedosto jatkaaksenne tuotteen muokkaamista.");
						res.redirect("back");
						return;
					}
				}
			});
		}
	});
};
//Remove product
module.exports.removeProduct = (req, res, next) => {
	Product.findById(req.params.id, function(err, foundProduct) {
		if(err) {
			req.flash("error", err.message);
			return res.redirect('back');
		} else {
			cloudinary.uploader.destroy(foundProduct.cover_id, (result) => {
				if(result.result === "not found") {
					return res.send("error");
				} else {
					foundProduct.remove((err) => {
						if(err) {
							return res.send("error");
						} else {
							res.send("success");
						}
					});
				}
			});
		}
	});
};