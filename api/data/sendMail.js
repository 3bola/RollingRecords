"use strict";
const nodemailer = require('nodemailer');
// const mg = require('nodemailer-mailgun-transport');
// const ejs = require('ejs');
// const auth = {
// 	auth: {
// 		api_key: process.env.MAILGUN_API_KEY,
// 		domain: 'sandbox3f95073801fb465a96ce0f00ed03f158.mailgun.org'
// 	}
// };
// const nodemailerMailgun = nodemailer.createTransport(mg(auth));
const sgTransport = require('nodemailer-sendgrid-transport');

//Initialize sgTransport
var options = {
  auth: {
    api_user: process.env.SENDGRID_UNAME,
    api_key: process.env.SENDGRID_PW
  }
}
var serverdata = {
	host: "",
	protocol: ""
};
//Helper functions 
//Set pricetag
function setPriceTag(price) {
	var formattedPrice;
  	var nLength = function(a) {
  		var e = 1;
  		while (Math.round(a * e) / e !== a) e *= 10;
  		return Math.log(e) / Math.LN10;
	} 
  	formattedPrice = `${Number.isInteger(price) ? `${price},00 €` : nLength(price) === 2 ? `${parseFloat(price).toFixed(2)} €` :  nLength(price) > 2 ? `${parseFloat(price).toFixed(2)} €` : `${price}0 €`}`;
  	return formattedPrice;
};
// output all orders items/products
function outputOrderItems(items) {
	for(var i = 0; i < items.length; i++) {
		return `
   			<tr>
			${items.map(item => `
        		<td>${item.item.fullname}</td>
				<td>${item.quantity} kpl</td>
				<td>${item.total_price_including_tax} €</td>`)}
    		</tr>
    	`;
	}
}
module.exports.setServerdata = (req, res, next) => {
	serverdata.host = req.headers.host;
	serverdata.protocol = req.protocol;
};
console.log(serverdata);
var mailer = nodemailer.createTransport(sgTransport(options));
 //Send email to request email confirmation
module.exports.sendActivationEmail = (req, res, user, next) => {
 // 	let contextObject = {
 //  		user: user
	// };
	let email = {
		from: 'Rolling Records <rollingrecords@outlook.com>',
  		to: user.email, // An array if you have multiple recipients.
  		subject: 'Vahvista sähköpostiosoite',
  		html: `
  				<h1>${ user.name.firstname } ${ user.name.lastname }, </h1>
				<p>pyydämme teitä vahvistamaan sähköpostiosoitteenne klikkaamalla alla olevaa linkkiä.</p>
				<p>Vasta sähköpostin vahvistuksen jälkeen käyttäjätilinne aktivoidaan ja voitte siirtyä asioimaan verkkokauppaamme.</p>
				<p>Suorittaaksenne käyttäjätilin aktivoinnin loppuun, kopioikaa ohessa oleva linkki selaimenne osoitekenttään, tai klikatkaa sitä hiirellä.</p>
				<a href="${req.protocol}://${req.headers.host}/kayttajahallinta/aktivointi/${ user.user.token }">wwww.rollingrecords.fi/kayttajahallinta/aktivointi/${ user.user.token }</a>
				<p>Jos ette ole rekisteröineet tätä sähköposti osoitetta, olkaa hyvä ja ottakaa yhteyttä <a href="${req.protocol}://${req.headers.host}/asiakaspalvelu">asiakaspalveluumme</a>!</p>
				<p>Tämä on automaattinen viesti, ethän vastaa tähän viestiin.</p>
				<p>Ystävällisin Terveisin, </p>
				<p>Rolling Records</p>
				<p>puh: +358 (0)50 344 55 39 </p>
				<p>email: rollingrecords@outlook.com</p>
				<p>www.rollingrecords.fi</p>
			`
	}
 	mailer.sendMail(email, function(err, info) {
  		if (err) {
    		console.log('Error: ' + err);
    		return next();
  		} else {
    		console.log('Response: ' + info);
    		next();
  		}
	});
};
//Send email to confirm activation
module.exports.activationConfirmation = (req, res, user, next) => {
	let email = {
		from: 'Rolling Records <rollingrecords@outlook.com>',
  		to: user.email,
  		subject: 'Tervetuloa Rolling Records Storeen',
  		html: `
  			<h1>${user.name.firstname} ${user.name.lastname}</h1> 
  			<h3>Rolling Records toivottaa teidät lämpimästi tervetulleeksi viihtyisään verkkokauppaamme!</h3>
  			<p>Voitte nyt turvallisesti selailla ja ostaa valikoimaamme, samalla kerryttää leimoja kanta-asiakas korttiinne joka 20 € ostoksesta.</p>
  			<p>Lisätietoa Bonusjärjestelmästämme löydätte <a href="${req.protocol}://${req.headers.host}/bonusjarjestelma">täältä</a>.</p>
  			<a href="${req.protocol}://${req.headers.host}">Verkkokauppaan</a>
  			<p>Tämä on automaattinen viesti, ethän vastaa tähän viestiin.</p>
  			<p>Ystävällisin Terveisin, </p>
			<p>Rolling Records</p>
			<p>puh: +358 (0)50 344 55 39 </p>
			<p>email: rollingrecords@outlook.com</p>
			<p>www.rollingrecords.fi</p>
  		`		
	};
	mailer.sendMail(email, function(err, info) {
  		if (err) {
    		console.log('Error: ' + err);
    		return next();
  		} else {
    		console.log('Response: ' + info);
    		next();
  		}
	});
};
//Send password recovery token to email user has provided
module.exports.sendPasswordRecoveryToken = (req, res, user, next) => {
	let email = {
		from: 'Rolling Records <rollingrecords@outlook.com>',
		to: user.email,
		subject: 'Salasanan palautus linkki',
		html: `
			<h1>${user.name.firstname} ${user.name.lastname}</h1>
			<h3>Lähetämme ohessa salasanan palautuslinkin, voitte palauttaa salasananne klikkaamalla linkkiä tai kopioimalla se selaimeenne.</h3>
			<p>Palauta salasana: </p>
			<a href="${req.protocol}://${req.headers.host}/kayttajahallinta/salasananpalautus/${user.resetPasswordToken}">www.rollingrecords.fi/kayttajahallinta/salasananpalautus/${user.resetPasswordToken}</a>
			<p>Jos ette ole pyytäneet salasanan palautusta tähän sähköpostiosoitteeseen, voitte vain poistaa tämän viestin.</p>
			<p>Halutessanne voitte myös olla yhteydessä <a href="${req.protocol}://${req.headers.host}/asiakaspalvelu">asiakaspalveluumme</a></p>
			<p>Tämä on automaattinen viesti, ethän vastaa tähän viestiin.</p>
			<p>Ystävällisin Terveisin, </p>
			<p>Rolling Records</p>
			<p>puh: +358 (0)50 344 55 39 </p>
			<p>email: rollingrecords@outlook.com</p>
			<p>www.rollingrecords.fi</p>
		`
	};
	mailer.sendMail(email, function(err, info) {
  		if (err) {
    		console.log('Error: ' + err);
    		return next();
  		} else {
    		console.log('Response: ' + info);
    		next();
  		}
	});
};
//Send confirmation on changed password
module.exports.confirmationOnPwChange = (req, res, user, next) => {
	let email = {
		from: 'Rolling Records<rollingrecords@outlook.com>',
		to: user.email,
		subject: 'Salasana vaihdettu',
		html: `
			<h1>${user.name.firstname} ${user.name.lastname}</h1>
			<h3>Salasananne on onnistuneesti vaihdettu.</h3>
			<p>Voitte nyt kirjautua asiakastilillenne käyttäen uutta salasanaanne ja sähköpostiosoitetta.</p>
			<p>Mikäli ette ole salasanaa vaihtaneet, pyydämme teitä olemaan välittömästi yhteydessä <a href="${req.protocol}://${req.headers.host}/asiakaspalvelu">asiakaspalveluumme</a>.</p>
			<p>Muussa tapauksessa toivotamme teille mukavia hetkiä valikoimamme parissa.</p>
			<p>Tämä on automaattinen viesti, ethän vastaa tähän viestiin.</p>
			<p>Ystävällisin Terveisin, </p>
			<p>Rolling Records</p>
			<p>puh: +358 (0)50 344 55 39 </p>
			<p>email: rollingrecords@outlook.com</p>
			<p>www.rollingrecords.fi</p>
		`
	};
	mailer.sendMail(email, function(err, info) {
  		if (err) {
    		console.log('Error: ' + err);
    		return next();
  		} else {
    		console.log('Response: ' + info);
    		next();
  		}
	});
};
//order confirmation
module.exports.orderConfirmation = (req, res, order, next) => {
	let email = {
		from: 'Rolling Records <rollingrecords@outlook.com>',
		to: order.payees_information.email,
		subject: `Tilaus Rolling Records Verkkokaupassa ${order.order_number}`,
		html: `
			<h1>${order.payees_information.firstname} ${order.payees_information.lastname}, kiitos tilauksestanne.</h1>
			<h3>Tilaus on vastaanotettu, tässä ovat tilauksen tiedot:</h3>
			<p>Maksutapa: <strong>${ order.payment_method }</strong></p>
			<p><strong>${ order.delivery_method.name }</strong></p>
			<table>
				<thead>
					<tr>
						<th>Tuote</th>
						<th>Määrä (kpl)</th>
						<th>Hinta (Eur)</th>
					</tr>
				</thead>
				<tbody>
					${order.items.map(item => `
							<tr>
								<td>${item.fullname}</td>
								<td>${item.quantity} kpl</td>
								<td>${setPriceTag(item.total_price_including_tax)}</td>
							</tr>
						`
						).join("")}
					<tr>
						<td>${order.delivery_method.name}</td>
						<td>1 kpl</td>
						<td>${setPriceTag(order.delivery_method.unit_price)}</td>
					</tr>
				</tbody>
			</table>
			<h4>${order.paid === false ? `Maksettava yhteensä: ${setPriceTag(order.payment.total_price)}` : `Maksettu yhteensä: ${setPriceTag(order.payment.total_price)}`}</h4>
			<p>Saatte ilmoituksen tiluksenne valmistumisesta sähköpostiinne. 1-3 arkipäivän sisällä.</p>
			${order.delivery_method.name !== "Nouto myymälästä" ? `<p>Jos tilauksenne sisältää <strong>ennakkovarattavia tuotteita</strong>, lähetetään tilauksenne kerralla, kun kaikki tilaamanne tuotteet ovat saavuttaneet julkaisupäivän.</p>`: `<br>`}
			<p>Maksamattomilla tilauksilla noutoaika on <strong>14vkr</strong>, siitä hetkestä kun olette vastaanottaneet ilmoituksen tilauksen valmistumisesta.</p>
			<p>Käyttämättömillä ja myyntikuntoisilla tuotteilla on 14vrk vaihto ja palautusoikeus. Ohjeet palautksen tekemiseen löytyvät <a href="${req.protocol}://${req.headers.host}/profiili/${order.client.id}">Profiili sivuilta</a>.</p>
			<p>Mikäli ette ole tehneet tätä tilausta, pyydämme teitä olemaan välittömästi yhteydessä <a href="${req.protocol}://${req.headers.host}/asiakaspalvelu">asiakaspalveluumme</a>.</p>
			<p>Tämä on automaattinen viesti, ethän vastaa tähän viestiin.</p>
			<p>Ystävällisin Terveisin, </p>
			<p>Rolling Records</p>
			<p>puh: +358 (0)50 344 55 39 </p>
			<p>email: rollingrecords@outlook.com</p>
			<p>rolling.tampere@outlook.com</p>
			<p>www.rollingrecords.fi</p>
		`
	};
	mailer.sendMail(email, function(err, info) {
  		if (err) {
    		console.log('Error: ' + err);
    		return next();
  		} else {
    		console.log('Response: ' + info);
    		return next();
  		}
	});
};
//Send notification that order has benn completed and ready to be delivered
module.exports.sendCompleteOrderVerificationEmail = (req, res, order, next) => {
	let email = {
		from: 'Rolling Records <rollingrecords@outlook.com>',
		to: order.payees_information.email,
		subject: `Tilaus Rolling Records Verkkokaupassa ${order.order_number}, tila muuttunut`,
		html: `
			<h1>${order.payees_information.firstname} ${order.payees_information.lastname}, on valmis ${order.delivery_method.name === "Nouto myymälästä" ? `noudettavaksi`: `lähetetty`}.</h1>
			<h3>Tilauksen tiedot:</h3>
			<p>Maksutapa: <strong>${ order.payment_method }</strong></p>
			<p><strong>${ order.delivery_method.name }</strong></p>
			<table>
				<thead>
					<tr>
						<th>Tuote</th>
						<th>Määrä (kpl)</th>
						<th>Hinta (Eur)</th>
					</tr>
				</thead>
				<tbody>
					${order.items.map(item => `
							<tr>
								<td>${item.fullname}</td>
								<td>${item.quantity} kpl</td>
								<td>${setPriceTag(item.total_price_including_tax)}</td>
							</tr>
						`
						).join("")}
					<tr>
						<td>${order.delivery_method.name}</td>
						<td>1 kpl</td>
						<td>${setPriceTag(order.delivery_method.unit_price)}</td>
					</tr>
				</tbody>
			</table>
			<p>Maksamattomilla tilauksilla noutoaika on <strong>14vkr</strong>, siitä hetkestä kun olette vastaanottaneet ilmoituksen tilauksen valmistumisesta.</p>
			<p>Käyttämättömillä ja myyntikuntoisilla tuotteilla on 14vrk vaihto ja palautusoikeus. Ohjeet palautksen tekemiseen löytyvät <a href="${req.protocol}://${req.headers.host}/profiili/${order.client.id}">Profiili sivuilta</a>.</p>
			<p>Mikäli teillä on kysyttävää koskien tätä tilausta, pyydämme teitä olemaan yhteydessä <a href="${req.protocol}://${req.headers.host}/asiakaspalvelu">asiakaspalveluumme</a>.</p>
			<p>Tämä on automaattinen viesti, ethän vastaa tähän viestiin.</p>
			<p>Ystävällisin Terveisin, </p>
			<p>Rolling Records</p>
			<p>puh: +358 (0)50 344 55 39 </p>
			<p>email: rollingrecords@outlook.com</p>
			<p>www.rollingrecords.fi</p>
		`
	};
	mailer.sendMail(email, function(err, info) {
  		if (err) {
    		console.log('Error: ' + err);
    		return next();
  		} else {
    		console.log('Response: ' + info);
    		return next();
  		}
	});
};
//Send confirmation that order has been paid and bonus system has been updated
module.exports.sendPaidOrderVerificationEmail = (req, res, user, order, next) => {
	let email = {
		from: 'Rolling Records <rollingrecords@outlook.com>',
		to: order.payees_information.email,
		subject: `Tilaus Rolling Records Verkkokaupassa ${order.order_number}, on maksettu`,
		html: `
			<h1>${order.payees_information.firstname} ${order.payees_information.lastname},</h1>
			<p>Tilaus on maksettu, tässä ovat tilauksen tiedot:</p>
			<table>
				<thead>
					<tr>
						<th>Tuote</th>
						<th>Määrä (kpl)</th>
						<th>Hinta (Eur)</th>
					</tr>
				</thead>
				<tbody>
					${order.items.map(item => `
							<tr>
								<td>${item.fullname}</td>
								<td>${item.quantity} kpl</td>
								<td>${setPriceTag(item.total_price_including_tax)}</td>
							</tr>
						`
						).join("")}
					<tr>
						<td>${order.delivery_method.name}</td>
						<td>1 kpl</td>
						<td>${setPriceTag(order.delivery_method.unit_price)}</td>
					</tr>
				</tbody>
			</table>
			<h4>Tilillenne on nyt päivitetty, teille tilauksestanne kertyvät leimat.</h4>
			<p>Käyttämättömillä ja myyntikuntoisilla tuotteilla on 14vrk vaihto ja palautusoikeus. Ohjeet palautksen tekemiseen löytyvät <a href="${req.protocol}://${req.headers.host}/profiili/${user.id}">Profiili sivuilta</a>.</p>
			<p>Tämä on automaattinen viesti, ethän vastaa tähän viestiin.</p>
			<p>Ystävällisin Terveisin, </p>
			<p>Rolling Records</p>
			<p>puh: +358 (0)50 344 55 39 </p>
			<p>email: rollingrecords@outlook.com</p>
			<p>www.rollingrecords.fi</p>
		`
	};
	mailer.sendMail(email, function(err, info) {
  		if (err) {
    		console.log('Error: ' + err);
    		return next();
  		} else {
    		console.log('Response: ' + info);
    		return next();
  		}
	});
};
// send contact reply message to the customer
module.exports.sendContactReplyConfirmation = (req, res, contact, next) => {
	let email = {
		from: `Rolling Records <rollingrecords@outlook.com>`,
		to: contact.email,
		subject: `Vastaus yhteydenottopyyntöönne, ${contact.subject}`,
		html: `
			<h1>${contact.fullname}, </h1>
			<h3>Tämä on ilmoitus siitä, että teidän yhteydenottopyyntöönne on vastattu.</h3>
			<p>Voitte käydä lukemassa profiili sivultanne kohdasta yhteydenoottopyynöt,</p>
			<p>tai klikkaamalla ohessa olevaa <strong><a href="${req.protocol}://${req.headers.host}/profiili/${contact.owner}">linkkiä</a></strong></p>
			<p>Tämä on automaattinen viesti, ethän vastaa tähän viestiin.</p>
			<p>Ystävällisin Terveisin, </p>
			<p>Rolling Records</p>
			<p>puh: +358 (0)50 344 55 39 </p>
			<p>email: rollingrecords@outlook.com</p>
			<p>www.rollingrecords.fi</p>
		`
	};
	mailer.sendMail(email, (err, info)  => {
		if(err) {
			console.log('Error: ' + err);
    		return next();
  		} else {
    		console.log('Response: ' + info);
    		return next();
  		}
	});
};
//Massages that are sent to admins only
//Message that notifies about new order
module.exports.sendNotificationOnNewOrder = (req, res, order, user, next) => {
	const mail_list = ["rolling.tampere@outlook.com", "rolling.sornainen@outlook.com"];
	let email = {
		from: 'Rolling Records <rollingrecords@outlook.com>',
		to: mail_list,
		subject: `Uusi tilaus on luotu, nro. ${order.order_number}`,
		html: `
			<h1>${order.pickup_store === 'posti' ? `Tomitustapa: Postipaketti, Lähetys ${order.delivery_store} myymälästä` : 'Toimitustapa: nouto myymälästä: '+order.pickup_store}</h1>
			<h3>Tilauksen tiedot:</h3>
			<h4>Tilausnumero: ${order.order_number}</h4>
			<h4>Asiakkaan nimi: ${order.payees_information.lastname}, ${order.payees_information.firstname}</h4>
			<table>
				<thead>
					<tr>
						<th>Tuote</th>
						<th>Määrä (kpl)</th>
						<th>Hinta (Eur)</th>
					</tr>
				</thead>
				<tbody>
					${order.items.map(item => `
							<tr>
								<td>${item.fullname}</td>
								<td>${item.quantity} kpl</td>
								<td>${setPriceTag(item.total_price_including_tax)}</td>
							</tr>
						`
						).join("")}
					<tr>
						<td>${order.delivery_method.name}</td>
						<td>1 kpl</td>
						<td>${setPriceTag(order.delivery_method.unit_price)}</td>
					</tr>
				</tbody>
			</table>
			<p>Maksutapa: ${order.payment_method}</p>
			<p>${order.paid === true ? "Maksettu: "+setPriceTag(order.payment.total_price_including_tax) : "Maksettava: "+setPriceTag(order.payment.total_price_including_tax)}</p>
			<p>Tilausta pääsee käsittelemään <strong><a href="${req.protocol}://${req.headers.host}/admin/user/${user.id }/order/${order.id}">Tästä</a></strong></p>
			<p>Tämä on automaattinen viesti, ethän vastaa tähän viestiin.</p>
			<p>Ystävällisin Terveisin, </p>
			<p>Rolling Records</p>
			<p>puh: +358 (0)50 344 55 39 </p>
			<p>email: rollingrecords@outlook.com</p>
			<p>rolling.tampere@outlook.com</p>
			<p>www.rollingrecords.fi</p>
		`
	};
	mailer.sendMail(email, function(err, info) {
  		if (err) {
    		console.log('Error: ' + err);
    		return next();
  		} else {
    		console.log('Response: ' + info);
    		return next();
  		}
	});
};
//Send email on new notification
module.exports.sendNotificationEmail = (users, notification) => {
	for(var i = 0; i < users.length; i ++) {
		let email = {
			from: 'Rolling Records <rollingrecords@outlook.com>',
			to: users[i].email,
			subject: `Uusi ${notification.isNewProduct === true ? "Julkaisupäivän saavuttaneiden LP levyjen lista" : "Nollatuotelista"}`,
			html: `
				<h1>${users[i].name.firstname} ${users[i].name.lastname}</h1>
				<h3>Tämä on ilmoitus siitä, että uusi ${notification.isNewProduct === true ? "Julkaisupäivän saavuttaneiden LP levyjen lista" : "Nollatuotelista"} on jälleen luotu.</h3>
				<p>Pääset selaamaan listaa klikkaamalla ohessa olevaa linkkiä: <a href="${serverdata.protocol}://${serverdata.host}/admin/notification/${notification._id}">${serverdata.protocol}://${serverdata.host}/admin/notification/${notification._id}</a></p>
				<p>Tämä on automaattinen viesti, ethän vastaa tähän viestiin.</p>
				<p>Ystävällisin Terveisin, </p>
				<p>Rolling Records</p>
				<p>puh: +358 (0)50 344 55 39 </p>
				<p>email: rollingrecords@outlook.com</p>
				<p>rolling.tampere@outlook.com</p>
				<p>www.rollingrecords.fi</p>
			`
		};
		mailer.sendMail(email, function(err, info) {
  			if (err) {
    			console.log('Error: ' + err);
    			return;
  			} else {
    			console.log('Response: ' + info);
    			return;
  			}
		});
	}
};