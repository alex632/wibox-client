// global variables
var authToken = "";
var wiboxurl = "http://wibox.wistron.com/wiboxv2";
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
function encode_utf8(s) {
	return unescape(encodeURIComponent(s));
}
function decode_utf8(s) {
	return decodeURIComponent(escape(s));
}

function loginWiBox(username, password) {
	var pwdHash = CryptoJS.MD5(password).toString(CryptoJS.enc.Base64).replace(/\=+/, '').replace(/\+/g, '-').replace(/\//g, '_');
	var pwdkey = Base64.encode(password).replace(/\=+/, '');
	var clientname = device.uuid;
	var clientDisplayname = device.platform + " " + device.version + "; " + device.model + "; " + device.uuid;
	authToken = "";
	$.ajax(wiboxurl + "/", {
		async: false,
		headers: {
			"User-Agent": "WiBox/2.0",
		//	"Connection": "Keep-Alive",
			"X-Op": "login",
			"X-Auth": username + ", " + pwdHash + ", " + clientname + ", " + pwdkey,
			"X-Client-Display-Name": clientDisplayname
		},
		complete: function(jqXHR, textStatus) {
			if (textStatus == "success" && jqXHR.status == "200" &&jqXHR.getResponseHeader("X-Status") == "0") {
				authToken = jqXHR.getResponseHeader("X-Auth-Token")
			}
		}
	});
	//alert("authToken="+authToken);
	return authToken==""?false:true;
}



function createThumbnailLink(folder, filename) {
	// thumbnail sample: http://wibox.wistron.com/wiboxv2/pic/MvnrwxV.gif?X-Op=create-thumbnail&X-Option=width=100;height=100;keep-aspect-ratio&X-Auth-Token=TNEiWCKAlVkjpiOtZ3smhQ
	dotp = filename.lastIndexOf('.');
	if ( dotp >= 0 ) {
		ext = filename.substr(dotp+1);
		switch ( ext.toLowerCase() ) {
			case "png": case "jpg": case "jpeg": case "gif": case "bmp": case "tif":	// create thumbnail for image files
				return wiboxurl + escape(folder+filename) + "?X-Op=create-thumbnail&X-Option=width=60;height=60;keep-aspect-ratio&X-Auth-Token=" + authToken;
			case "mp3": return "img/mp3.svg";	// audio
			case "m4a": return "img/m4a.svg";
			case "wav": return "img/wav.svg";
			case "wma": return "img/wma.svg";
			case "ogg": return "img/ogg.svg";
			case "asf": case "mid": return "img/music.svg";
			case "avi": return "img/avi.svg";	// video
			case "flv": return "img/flv.svg";
			case "mov": return "img/mov.svg";
			case "mp4": return "img/mp4.svg";
			case "mpg": return "img/mpg.svg";
			case "ogv": case "webm": case "rm": return "img/video.svg";
			case "wmv": return "img/video-ms.svg";
			case "pdf": return "img/pdf.svg";	// document
			case "txt": case "rtf": return "img/txt.svg";
			case "doc": return "img/doc.svg";
			case "docx": return "img/docx.svg";
			case "ppt": case "pps": return "img/ppt.svg";
			case "pptx": return "img/pptx.svg";
			case "xls": return "img/xls.svg";
			case "xlsx": return "img/xlsx.svg";
			case "csv": return "img/csv.svg";
			case "htm": case "html": return "img/html.svg";
			case "xml": case "plist": return "img/xml.svg";
			case "vsd": return "img/visio.svg";
			case "zip": return "img/zip.svg";	// archive
			case "gz": case "tgz": case "rar": return "img/compression.svg";
			case "apk": return "img/apk.svg";	// others
			case "exe": return "img/exe.svg";
		}
	}
	return "img/file.svg";
}

