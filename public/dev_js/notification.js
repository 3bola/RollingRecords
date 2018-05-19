	$(function() {
		var socket = io();
		socket.on("connect", function() {
	 		console.log('User connected');
	 	});
		socket.on("new-notification", function(newNotification, count) {
	 		$("#stockNf").html(count);
			$("#notificationsList").append(`
				<li class="media">
					<a href="${newNotification.newContact === true ? '/' : '/admin/'}${newNotification.newContact === true ? 'contact' : notification}/${newNotification._id}">
						<div class="col-md-2">
							<div class="media-left">
								<img class="img-responsive" src="/images/notification.png">
							</div>
						</div>
						<div class="col-md-7">
							<div class="media-body left-alinged">
								<h4 class="media-heading">${newNotification.isOutOfStock === true ? "Nollatuotelista" : newNotification.isNewProduct ? "Julkaisupäivän saavuttaneet LP:t" : newNotification.newContact === true ? "Uusia yhteydenottopyyntöjä on vastaanotettu." : "Ostoskoreja on poistettu onnistuneesti."}</h4>
								<p>${newNotification.isOutOfStock === true ? "Tuotteita listalla "+newNotification.products.length + "kpl" : newNotification.isNewProduct === true ? "Tuotteita listalla " + newNotification.products.length + "kpl" : newNotification.newContact === true ? "Uusia yhteydenottopyyntöjä listalla "+newNotification.contacts.length + "kpl" : "Ostoskoreja poistettu"}</p>
								<p>Lista luotu: ${moment(newNotification.createdAt).locale("fi").format("LLL")}</p>
							</div>
						</div>
					</a>
					<div class="col-md-3">
						<form action="/admin/notification/${newNotification._id}?_method=PATCH" method="POST">
							<button type="submit" class="btn ${newNotification.isRead === true ? "btn-primary" : "btn-warning"} openNotification">${newNotification.isRead === true ? "Käsitelty" : "Merkkaa Käsitellyksi"}</button>
						</form>
					</div>
				</li>
			`);
		});
		$(document).ready(function() {
			socket.emit("get-notifications");
			socket.on("all-notifications", function(allNotifications, count) {
				$("#stockNf").html(count);
				$("#notificationsList").html("");
				allNotifications.forEach(function(notification) {
					$("#notificationsList").append(`
						<li class="media">
							<a href="/admin/notification/${notification._id}">
								<div class="col-md-2">
									<div class="media-left">
										<img class="img-responsive" src="/images/notification.png">
									</div>
								</div>
								<div class="col-md-7">
									<div class="media-body left-alinged">
      									<h4 class="media-heading">${notification.isOutOfStock === true ? "Nollatuotelista" : notification.isNewProduct ? "Julkaisupäivän saavuttaneet LP:t" : notification.newContacts === true ? "Uusia yhteydenottopyyntöjä" : "Ostoskoreja on poistettu onnistuneesti."}</h4>
										<p>${notification.isOutOfStock === true ? "Tuotteita listalla "+notification.products.length + "kpl" : notification.isNewProduct === true ? "Tuotteita listalla " + notification.products.length + "kpl" : notification.newContacts === true ? "Uusia yhteydenottopyyntöjä listalla "+notification.contacts.length + "kpl" : "Ostoskoreja poistettu"}</p>
   										<p>Lista luotu: ${moment(notification.createdAt).locale("fi").format("LLL")}</p>
   									</div>
   								</div>
   							</a>
   							<div class="col-md-3">
   								<form action="/admin/notification/${notification._id}?_method=PATCH" method="POST">
   									<button type="submit" class="btn ${notification.isRead === true ? "btn-primary" : "btn-warning"} openNotification">${notification.isRead === true ? "Käsitelty" : "Merkkaa Käsitellyksi"}</button>
   								</form>
   							</div>
						</li>
					`);
				});
			});
		});
		$("#showNotifications").on("click", function() {
			socket.emit("get-notifications");
		});
		socket.on("all-notifications", function(allNotifications, count) {
			console.log(allNotifications, count);
			$("#stockNf").html(count);
		});
	});