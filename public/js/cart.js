$(document).ready(function(){function t(t){var a=function(t){for(var a=1;Math.round(t*a)/a!==t;)a*=10;return Math.log(a)/Math.LN10};return`${Number.isInteger(t)?`${t},00 €`:2===a(t)?`${parseFloat(t).toFixed(2)} €`:a(t)>2?`${parseFloat(t).toFixed(2)} €`:`${t}0 €`}`}$(".breadcrumb").on("click",".item",function(t){t.preventDefault();var a=$(this).attr("href");window.location=a});var a,i,o,s,n,l,e,r,c,u=$("#cartId").val(),d=$(".btn-to-toggle");$("#cartTotalQuantity");function _(t){$(t).closest(".cart-buttons").find(".quantity"),a=0===parseInt($(t).closest(".cart-buttons").find(".total_quantity").val())?1:parseInt($(t).closest(".cart-buttons").find(".total_quantity").val()),i=parseInt($(t).closest(".cart-buttons").find(".quantity_total").val()),o=parseFloat($(t).closest(".cart-buttons").find(".tax_amount").val()),s=parseFloat($(t).closest(".cart-buttons").find(".total_tax_amount").val()),Number.isInteger($(t).closest(".cart-buttons").find(".total_price").val())?parseInt($(t).closest(".cart-buttons").find(".total_price").val()):parseFloat($(t).closest(".cart-buttons").find(".total_price").val()),n=Number.isInteger($(t).closest(".cart-buttons").find(".unit_price").val())?parseInt($(t).closest(".cart-buttons").find(".unit_price").val()):parseFloat($(t).closest(".cart-buttons").find(".unit_price").val()),l=Number.isInteger($(t).closest(".cart-buttons").find(".total_unit_price").val())?parseInt($(t).closest(".cart-buttons").find(".total_unit_price").val()):parseFloat($(t).closest(".cart-buttons").find(".total_unit_price").val()),e=parseFloat($(t).closest(".cart-buttons").find(".unit_price_excluding_tax").val()),r=parseFloat($(t).closest(".cart-buttons").find(".total_unit_price_excluding_tax").val()),c=$(t).closest(".cart-buttons").find(".product_genre").val()}$(".minus").on("click",function(){_(this),1==a?(s=o,r=e,l=n,a=1):(s=(s-o).toFixed(2),r=(r-e).toFixed(2),a--,l=parseInt(l-n)),$(this).closest(".cart-buttons").find(".quantity").html(a),$(this).closest(".cart-buttons").find(".total_tax_amount").val(s),$(this).closest(".cart-buttons").find(".total_unit_price_excluding_tax").val(r),$(this).closest(".cart-buttons").find(".total_quantity").val(a),$(this).closest(".cart-buttons").find(".total_unit_price").val(l),$(this).closest(".cart-buttons").find(".total_price").val(t(l))}),$(".plus").on("click",function(){_(this),a<i?(a++,l=parseInt(l+n),s=(s+o).toFixed(2),r=(r+e).toFixed(2)):(a=a,l=l,s=s,r=r),$(this).closest(".cart-buttons").find(".quantity").html(a),$(this).closest(".cart-buttons").find(".total_tax_amount").val(s),$(this).closest(".cart-buttons").find(".total_unit_price_excluding_tax").val(r),$(this).closest(".cart-buttons").find(".total_quantity").val(a),$(this).closest(".cart-buttons").find(".total_unit_price").val(l),$(this).closest(".cart-buttons").find(".total_price").val(t(l))}),$(".addToCart").on("click",function(){_(this);var t={id:$(this).closest(".cart-buttons").find(".product_id").val(),total_quantity:a,total_price:l,unit_price:n,tax_amount:o,total_tax_amount:s,unit_price_excluding_tax:e,total_unit_price_excluding_tax:r,genre:c};$.post("/ostoskori/"+u,t,function(t){"error"!==t?($("#success").html('\n\t\t\t\t\t<div class="alert alert-success alert-dismissible fade in" role="alert">\n\t\t\t\t\t\t<button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            \t\t\t\t<span aria-hidden="true">&times;</span>\n          \t\t\t\t</button>\n\t\t\t\t\t\t<p>Tuote on lisätty ostoskoriin.</p>\n\t\t\t\t\t</div>\n\t\t\t\t'),$("#cart #total_price").html(`${t.total_price_including_tax} €`),$("#cart #totalQuantity").html(`\n\t\t\t\t\t${t.total}\n\t\t\t\t`)):$("#error").html('\n\t\t\t\t\t<div class="alert alert-danger alert-dismissible fade in" role="alert">\n\t\t\t\t\t\t<button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            \t\t\t\t<span aria-hidden="true">&times;</span>\n          \t\t\t\t</button>\n\t\t\t\t\t\t<p>Ostoskoria ei voitu löytää, tai lisätä siihen tuotetta / tuotteita.</p>\n\t\t\t\t\t</div>\n\t\t\t\t')})}),$(".editQuantityPlus").on("click",function(){d.prop("disabled",!0),_(this);var p=$(this).closest(".product-row").find(".totalQuantityToDisplay"),b=$(this).closest(".product-row").find(".totalPriceToDisplay");if(a<i){a++,l=Number.isInteger(n)?parseInt(l+n):parseFloat(l+n).toFixed(2),s=parseFloat(s+o).toFixed(2),r=parseFloat(r+e).toFixed(2),$(this).closest(".cart-buttons").find(".total_tax_amount").val(s),$(this).closest(".cart-buttons").find(".total_unit_price_excluding_tax").val(r),$(this).closest(".cart-buttons").find(".total_quantity").val(a),$(this).closest(".cart-buttons").find(".total_unit_price").val(l);var m={method:"add",item_id:$(this).attr("item_id"),id:$(this).closest(".cart-buttons").find(".productId").val(),total_quantity:a,total_price:l,unit_price:n,tax_amount:o,total_tax_amount:s,unit_price_excluding_tax:e,total_unit_price_excluding_tax:r,genre:c};$.ajax({url:`/ostoskori/${u}`,method:"PATCH",data:m,success:function(i){"error"!==i?(d.prop("disabled",!1),$("#cartTotalPriceIncludingTax").html(`${t(i.total_price_including_tax)}`),$("#cartTotalQuantity").html(`${i.total} kpl`),$("#cartTotalTaxAmount").html(`${t(i.total_tax_amount)}`),$("#cartTotalPriceExcludingTax").html(`${t(i.total_price_excluding_tax)}`),b.html(`${t(l)}`),p.html(`${a} kpl`)):(d.prop("disabled",!1),$("#cartErrorMsg").html('\n\t\t\t\t\t\t\t<div class="alert alert-danger alert-dismissible fade in" role="alert">\n\t\t\t\t\t\t\t\t<button type="button" class="close" data-dismiss="alert" aria-label="Close">\n\t            \t\t\t\t\t<span aria-hidden="true">&times;</span>\n\t          \t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t<p>Tuotteen määrää ei voitu muokata.</p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t'))}})}else a=a,l=l,s=s,r=r,$(this).closest(".cart-buttons").find(".total_tax_amount").val(s),$(this).closest(".cart-buttons").find(".total_unit_price_excluding_tax").val(r),$(this).closest(".cart-buttons").find(".total_quantity").val(a),$(this).closest(".cart-buttons").find(".total_unit_price").val(l),d.prop("disabled",!1)}),$(".editQuanityMinus").on("click",function(){d.prop("disabled",!0),_(this);var i=$(this).closest(".product-row").find(".totalQuantityToDisplay"),p=$(this).closest(".product-row").find(".totalPriceToDisplay");if(1==a)a=a,l=l,s=s,r=r,$(this).closest(".cart-buttons").find(".total_tax_amount").val(s),$(this).closest(".cart-buttons").find(".total_unit_price_excluding_tax").val(r),$(this).closest(".cart-buttons").find(".total_quantity").val(a),$(this).closest(".cart-buttons").find(".total_unit_price").val(l),d.prop("disabled",!1);else{a--,l-=n,s=parseFloat(s-o).toFixed(2),r=parseFloat(r-e).toFixed(2),$(this).closest(".cart-buttons").find(".total_tax_amount").val(s),$(this).closest(".cart-buttons").find(".total_unit_price_excluding_tax").val(r),$(this).closest(".cart-buttons").find(".total_quantity").val(a),$(this).closest(".cart-buttons").find(".total_unit_price").val(l);var b={method:"exclude",item_id:$(this).attr("item_id"),id:$(this).closest(".cart-buttons").find(".productId").val(),total_quantity:a,total_price:l,unit_price:n,tax_amount:o,total_tax_amount:Number(s),unit_price_excluding_tax:e,total_unit_price_excluding_tax:Number(r),genre:c};$.ajax({url:`/ostoskori/${u}`,method:"PATCH",data:b,success:function(o){"error"!==o?(d.prop("disabled",!1),$("#cartTotalPriceIncludingTax").html(`${t(o.total_price_including_tax)}`),$("#cartTotalQuantity").html(`${o.total} kpl`),$("#cartTotalTaxAmount").html(`${t(o.total_tax_amount)}`),$("#cartTotalPriceExcludingTax").html(`${t(o.total_price_excluding_tax)}`),p.html(`${t(l)}`),i.html(`${a} kpl`)):(d.prop("disabled",!1),$("#cartErrorMsg").html('\n\t\t\t\t\t\t\t<div class="alert alert-danger alert-dismissible fade in" role="alert">\n\t\t\t\t\t\t\t\t<button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            \t\t\t\t\t\t<span aria-hidden="true">&times;</span>\n          \t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t<p>Tuotteen määrää ei voitu muokata.</p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t'))}})}}),$(".deleteItem").on("submit",function(i){i.preventDefault(),d.prop("disabled",!0),_(this);var p={method:"remove",item_id:$(this).closest(".cart-buttons").find(".itemsId").val(),id:$(this).closest(".cart-buttons").find(".productId").val(),total_quantity:a,total_price:l,unit_price:n,tax_amount:o,total_tax_amount:s,unit_price_excluding_tax:e,total_unit_price_excluding_tax:r,genre:c},b=$(this).closest(".cartItem");$.ajax({url:`/ostoskori/${u}`,method:"PATCH",data:p,success:function(a){"error"!==a?(b.remove(),d.prop("disabled",!1),$("#cartTotalPriceIncludingTax").html(`${t(a.total_price_including_tax)}`),$("#cartTotalQuantity").html(`${a.total} kpl`),$("#cartTotalTaxAmount").html(`${t(a.total_tax_amount)}`),$("#cartTotalPriceExcludingTax").html(`${t(a.total_price_excluding_tax)}`)):(d.prop("disabled",!1),$("#cartErrorMsg").html('\n\t\t\t\t\t\t<div class="alert alert-danger alert-dismissible fade in" role="alert">\n\t\t\t\t\t\t\t<button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            \t\t\t\t\t<span aria-hidden="true">&times;</span>\n          \t\t\t\t\t</button>\n\t\t\t\t\t\t\t<p>Tuotteen poistaminen ostoskorista epäonnistui.</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t'))}})})});