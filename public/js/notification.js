$(function(){var t=io();t.on("connect",function(){console.log("User connected")}),t.on("new-notification",function(t,n){$("#stockNf").html(n),$("#notificationsList").append(`\n\t\t\t\t<li class="media">\n\t\t\t\t\t<a href="${!0===t.newContact?"/":"/admin/"}${!0===t.newContact?"contact":notification}/${t._id}">\n\t\t\t\t\t\t<div class="col-md-2">\n\t\t\t\t\t\t\t<div class="media-left">\n\t\t\t\t\t\t\t\t<img class="img-responsive" src="/images/notification.png">\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="col-md-7">\n\t\t\t\t\t\t\t<div class="media-body left-alinged">\n\t\t\t\t\t\t\t\t<h4 class="media-heading">${!0===t.isOutOfStock?"Nollatuotelista":t.isNewProduct?"Julkaisupäivän saavuttaneet LP:t":!0===t.newContact?"Uusia yhteydenottopyyntöjä on vastaanotettu.":"Ostoskoreja on poistettu onnistuneesti."}</h4>\n\t\t\t\t\t\t\t\t<p>${!0===t.isOutOfStock?"Tuotteita listalla "+t.products.length+"kpl":!0===t.isNewProduct?"Tuotteita listalla "+t.products.length+"kpl":!0===t.newContact?"Uusia yhteydenottopyyntöjä listalla "+t.contacts.length+"kpl":"Ostoskoreja poistettu"}</p>\n\t\t\t\t\t\t\t\t<p>Lista luotu: ${moment(t.createdAt).locale("fi").format("LLL")}</p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</a>\n\t\t\t\t\t<div class="col-md-3">\n\t\t\t\t\t\t<form action="/admin/notification/${t._id}?_method=PATCH" method="POST">\n\t\t\t\t\t\t\t<button type="submit" class="btn ${!0===t.isRead?"btn-primary":"btn-warning"} openNotification">${!0===t.isRead?"Käsitelty":"Merkkaa Käsitellyksi"}</button>\n\t\t\t\t\t\t</form>\n\t\t\t\t\t</div>\n\t\t\t\t</li>\n\t\t\t`)}),$(document).ready(function(){t.emit("get-notifications"),t.on("all-notifications",function(t,n){$("#stockNf").html(n),$("#notificationsList").html(""),t.forEach(function(t){$("#notificationsList").append(`\n\t\t\t\t\t\t<li class="media">\n\t\t\t\t\t\t\t<a href="/admin/notification/${t._id}">\n\t\t\t\t\t\t\t\t<div class="col-md-2">\n\t\t\t\t\t\t\t\t\t<div class="media-left">\n\t\t\t\t\t\t\t\t\t\t<img class="img-responsive" src="/images/notification.png">\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="col-md-7">\n\t\t\t\t\t\t\t\t\t<div class="media-body left-alinged">\n      \t\t\t\t\t\t\t\t\t<h4 class="media-heading">${!0===t.isOutOfStock?"Nollatuotelista":t.isNewProduct?"Julkaisupäivän saavuttaneet LP:t":!0===t.newContacts?"Uusia yhteydenottopyyntöjä":"Ostoskoreja on poistettu onnistuneesti."}</h4>\n\t\t\t\t\t\t\t\t\t\t<p>${!0===t.isOutOfStock?"Tuotteita listalla "+t.products.length+"kpl":!0===t.isNewProduct?"Tuotteita listalla "+t.products.length+"kpl":!0===t.newContacts?"Uusia yhteydenottopyyntöjä listalla "+t.contacts.length+"kpl":"Ostoskoreja poistettu"}</p>\n   \t\t\t\t\t\t\t\t\t\t<p>Lista luotu: ${moment(t.createdAt).locale("fi").format("LLL")}</p>\n   \t\t\t\t\t\t\t\t\t</div>\n   \t\t\t\t\t\t\t\t</div>\n   \t\t\t\t\t\t\t</a>\n   \t\t\t\t\t\t\t<div class="col-md-3">\n   \t\t\t\t\t\t\t\t<form action="/admin/notification/${t._id}?_method=PATCH" method="POST">\n   \t\t\t\t\t\t\t\t\t<button type="submit" class="btn ${!0===t.isRead?"btn-primary":"btn-warning"} openNotification">${!0===t.isRead?"Käsitelty":"Merkkaa Käsitellyksi"}</button>\n   \t\t\t\t\t\t\t\t</form>\n   \t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t`)})})}),$("#showNotifications").on("click",function(){t.emit("get-notifications")}),t.on("all-notifications",function(t,n){console.log(t,n),$("#stockNf").html(n)})});