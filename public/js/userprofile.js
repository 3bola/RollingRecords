$(document).ready(function(){var t=$("#editUserInformationForm"),e=$("#editUserInformationBtn"),a=$("#cancelBtn"),s=$("#editUserInformationSubmitBtn");e.on("click",function(a){a.preventDefault(),e.hide(800),t.slideDown(1e3)}),a.on("click",function(a){a.preventDefault(),t.slideUp(800),e.show(1e3)});var i,n,l,r,m={email:"",firstname:"",lastname:"",mobile_number:""};function o(){""!==(i=$("#email").val())&&/^[a-zA-Z0-9\_\-\.]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,4}$/.test(i)?($("#email").addClass("success"),$("#email").removeClass("error"),$("#registerMsg1").html(""),m.email=i,""!==m.email&&""!==m.mobile_number&&""!==m.firstname&&""!==m.lastname?s.prop("disabled",!1):s.prop("disabled",!0)):($("#email").removeClass("success"),$("#email").addClass("error"),$("#registerMsg1").html(`\n\t\t\t\t<div class="alert alert-danger alert-dismissible fade in" role="alert">\n\t\t\t\t\t<button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            \t\t\t<span aria-hidden="true">&times;</span>\n          \t\t\t</button>\n\t\t\t\t\t<p>Virhe!</p>\n\t\t\t\t\t<p>"${i}", ei vastaa sähköpostiosoitteen vaatimaa formaattia.</p>\n\t\t\t\t</div>\n\t\t\t`),$("#email").val(""),m.email=""),""===(n=$("#mobileNumber").val())||n.length<1?($("#mobileNumber").removeClass("success"),$("#mobileNumber").addClass("error"),$("#registerMsg2").html('\n\t\t\t\t<div class="alert alert-danger alert-dismissible fade in" role="alert">\n\t\t\t\t\t<button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            \t\t\t<span aria-hidden="true">&times;</span>\n          \t\t\t</button>\n\t\t\t\t\t<p>Virhe!</p>\n\t\t\t\t\t<p>Puhelin numero on vaadittu.</p>\n\t\t\t\t</div>\n\t\t\t'),$("#mobileNumber").val(""),m.mobile_number=""):""!==n&&/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(n)?($("#mobileNumber").removeClass("error"),$("#mobileNumber").addClass("success"),$("#registerMsg2").html(""),m.mobile_number=n,""!==m.email&&""!==m.mobile_number&&""!==m.firstname&&""!==m.lastname?s.prop("disabled",!1):s.prop("disabled",!0)):($("#mobileNumber").removeClass("success"),$("#mobileNumber").addClass("error"),$("#registerMsg2").html('\n\t\t\t\t<div class="alert alert-danger alert-dismissible fade in" role="alert">\n\t\t\t\t\t<button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            \t\t\t<span aria-hidden="true">&times;</span>\n          \t\t\t</button>\n\t\t\t\t\t<p>Virhe!</p>\n\t\t\t\t\t<p>Antamanne puhelinnumero, ei vastaa Suomen virallista puhelinnuero formaattia.</p>\n\t\t\t\t</div>\n\t\t\t'),$("#mobileNumber").val(""),m.mobile_number=""),""!==(l=$("#firstname").val())&&/^[a-zA-ZäöüÄÖÜß]{2,30}$/.test(l)?($("#firstname").removeClass("error"),$("#firstname").addClass("success"),$("#registerMsg3").html(""),m.firstname=l,""!==m.email&&""!==m.mobile_number&&""!==m.firstname&&""!==m.lastname?s.prop("disabled",!1):s.prop("disabled",!0)):($("#firstname").removeClass("success"),$("#firstname").addClass("error"),$("#registerMsg3").html('\n\t\t\t\t<div class="alert alert-danger alert-dismissible fade in" role="alert">\n\t\t\t\t\t<button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            \t\t\t<span aria-hidden="true">&times;</span>\n          \t\t\t</button>\n\t\t\t\t\t<p>Virhe!</p>\n\t\t\t\t\t<p>Etunimen oltava 2 - 30 merkkiä pitkä ja se voi sisältää vain kirjaimia a-z ja A-Z.</p>\n\t\t\t\t</div>\n\t\t\t'),$("#firstname").val(""),m.firstname=""),""!==(r=$("#lastname").val())&&/^[a-zA-ZäöüÄÖÜß]{2,30}$/.test(r)?($("#lastname").removeClass("error"),$("#lastname").addClass("success"),$("#registerMsg4").html(""),m.lastname=r,""!==m.email&&""!==m.mobile_number&&""!==m.firstname&&""!==m.lastname?s.prop("disabled",!1):s.prop("disabled",!0)):($("#lastname").removeClass("success"),$("#lastname").addClass("error"),$("#registerMsg4").html('\n\t\t\t\t<div class="alert alert-danger alert-dismissible fade in" role="alert">\n\t\t\t\t\t<button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            \t\t\t<span aria-hidden="true">&times;</span>\n          \t\t\t</button>\n\t\t\t\t\t<p>Virhe!</p>\n\t\t\t\t\t<p>Sukunimen oltava 2 - 30 merkkiä pitkä ja se voi sisältää vain kirjaimia a-z ja A-Z.</p>\n\t\t\t\t</div>\n\t\t\t'),$("#lastname").val(""),m.lastname="")}o(),$("#email").on("change",function(){o()}),$("#mobileNumber").on("change",function(){o()}),$("#firstname").on("change",function(){o()}),$("#lastname").on("change",function(){o()})});