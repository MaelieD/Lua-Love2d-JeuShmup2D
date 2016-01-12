/* $Id: fonctions.js 919 2011-05-08 18:16:55Z mike007 $ */

function control_form(ids_champs)
{
	/* ids_champs est décomposé en deux : ID,NomAffichageAlert */
	ids_champs = ids_champs.split(' ');
	for (var i=0 ; i < ids_champs.length ; i++ )
	{
		var id_champ = ids_champs[i].split(',')[0];
		if (document.getElementById(id_champ) && (document.getElementById(id_champ).style.display != 'none' || id_champ=='postzone'))
		{
			var name_champ = ids_champs[i].split(',')[1];
			var value_champ = document.getElementById(id_champ).value.replace(/^\s+/g,'').replace(/\s+$/g,'');
			if (value_champ == '')
			{
				alert ('Le champ « '+name_champ.replace(/_/gi,' ')+' » n\'est pas renseigné.');

				document.getElementById(id_champ).value='';
				document.getElementById(id_champ).focus();
				return false;
			}
		}
	}
	if (document.getElementById('submit'))
	{
		document.getElementById('submit').disabled = true;
	}
	if (document.getElementById('validform'))
	{
		document.getElementById('validform').disabled = true;
	}
	return true;
}

function Resize_TA(id, px, type)
{
	// 1row = 15px ; 1 col = 6 px
	var TA = document.getElementById(id);
	var apercuID = document.getElementById('apercu');

	if (TA.rows)
	{
		if( type == 'height' )
		{
			var current_rows = TA.rows ? TA.rows : 13;
			var new_rows = current_rows + px;
			if( new_rows > 4 )
			{
				TA.rows = new_rows;
				TA.style.height = new_rows*15 + "px";
				if (apercuID)	apercuID.style.height = new_rows*15 + "px";
			}
		}
		else
		{
			var current_cols = TA.cols ? TA.cols : 90;
			var new_cols = current_cols + px;

			if( new_cols > 45 )
			{
				TA.cols = new_cols;
				TA.style.width = new_cols*6 + "px";
				if (apercuID)	apercuID.style.width = new_cols*6 + "px";
			}
		}
	}
}

function choice_format_post(val)
{
	document.getElementById('apercu_check').getElementsByTagName('input')[0].checked=false;
	pr_act(false);
	// si bbcode val=1
	if (val=='1')
	{
		document.getElementById('actif').removeAttribute('disabled');
		document.getElementById('actif').checked=true;
		if (document.getElementById('lien_postzone'))
		{
			document.getElementById('lien_postzone').style.display='none';
			document.getElementById('lien_postzone').disabled=true;
			document.getElementById('lien_postzone').name='texte_old';
		}
		document.getElementById('HTML_prev_button').style.display='none';
		document.getElementById('apercu_check').style.display='block';
		document.getElementById('bbcode_AllChoice').style.display='block';
		if (document.getElementById('bbcode_plus'))
			document.getElementById('bbcode_plus').style.display='block';
		document.getElementById('postzone').style.display='block';
		if (document.getElementById('dl_accroche'))
			document.getElementById('dl_accroche').style.display='block';
	}
	else
	{
		document.getElementById('noactif').checked=true;
		document.getElementById('actif').disabled=true;
		active_smil('noactif');
		document.getElementById('apercu_check').style.display='none';
		document.getElementById('bbcode_AllChoice').style.display='none';
		if (document.getElementById('bbcode_plus'))
			document.getElementById('bbcode_plus').style.display='none';
		if (val=='0')
		{
			if (document.getElementById('lien_postzone'))
			{
				document.getElementById('lien_postzone').style.display='none';
				document.getElementById('lien_postzone').disabled=true;
				document.getElementById('lien_postzone').name='texte_old';
			}
			if (document.getElementById('dl_accroche'))
				document.getElementById('dl_accroche').style.display='block';
			document.getElementById('HTML_prev_button').style.display='block';
			document.getElementById('postzone').style.display='block';
		}
		else
		{
			document.getElementById('HTML_prev_button').style.display='none';
			document.getElementById('postzone').style.display='none';
			if (document.getElementById('dl_accroche'))
				document.getElementById('dl_accroche').style.display='none';
			if (document.getElementById('lien_postzone'))
			{
				document.getElementById('lien_postzone').style.display='block';
				document.getElementById('lien_postzone').disabled=false;
				document.getElementById('lien_postzone').name='texte';
			}
		}
	}
}

var CacheCacheTimeout;
var blocked = false;
var previous_variable;
var previous_texte1;
var previous_texte2;
function cachecache_auto(variable,delay,stop,texte1,texte2)
{
	if (stop)
	{
		clearTimeout(CacheCacheTimeout);
	}
	else if (delay>0)
	{
		clearTimeout(CacheCacheTimeout);
		CacheCacheTimeout = setTimeout('cachecache(\''+variable+'\',\'\',\''+texte1+'\',\''+texte2+'\')', delay);
	}

}
function cachecache(variable,delay,texte1,texte2)
{
	var bloc = document.getElementById(variable);
	if( CacheCacheTimeout )
		clearTimeout(CacheCacheTimeout);

	if(bloc.style.display=="none")
	{
		if (typeof previous_texte1 != "undefined" && previous_texte1!='' && previous_texte1!='undefined')
			if( document.getElementById(previous_variable+"_lien") )
				document.getElementById(previous_variable+"_lien").innerHTML = previous_texte1;
		if (typeof texte2 != "undefined" && texte2!='' && texte2!='undefined')
		{
			document.getElementById(variable+"_lien").innerHTML = texte2;
		}
		if( document.getElementById(previous_variable) )
			document.getElementById(previous_variable).style.display = "none";
		bloc.style.display = "block";
		blocked = true;
		if (typeof delay != "undefined" && delay!='') previous_variable = variable;
		previous_texte1 = texte1;
		if ( is_msie ) IE_CorrectAlpha_PNG(true);
	}
	else
	{
		if (typeof texte1 != "undefined"  && texte1!='' && texte1!='undefined')
		{
			document.getElementById(variable+"_lien").innerHTML = texte1;
		}
		bloc.style.display = "none";
		blocked = false;
	}
	if (typeof delay != "undefined" && delay!='')
	{
		if(blocked) cachecache_auto(variable,delay,0,texte1,texte2);
	}
}

//PopUp centre
function popupcentre(url,nom,width,height,scroll)
{
	if (typeof scroll == 'undefined')
	{
		scroll='yes';
	}
	nom = nom.replace(/ /g, '_' );
	window.open(url,nom,'width='+width+',height='+height+',top='+(screen.height-height)/2+',left='+(screen.width-width)/2+',scrollbars='+scroll+',titlebar=no,directories=no,status=no,toolbar=no,menubar=no,resizable=no,location=no',false);
}


//PopUp en haut à gauche
function popup(url,nom,width,height,scroll,arriereplan)
{
	if (typeof scroll == 'undefined')
	{
		scroll='yes';
	}
	nom = nom.replace(/ /g, '_' );
	window.open(url,nom,'width='+width+',height='+height+',top=0,left=0,scrollbars='+scroll+',titlebar=no,directories=no,status=no,toolbar=no,menubar=no,resizable=no,location=no');
	if (arriereplan)
	{
		self.focus();
	}
}

function KmTo(c)
{
	c=unescape(c);
	var l=c.length;
	var e="";
	for(var i=0;i<l;i++)
	{
		e+=String.fromCharCode(Kle.charCodeAt(i)^c.charCodeAt(i));
	}
	window.location.href = e;
}

function ShowImg(id_elt,url_elt)
{
	if (document.getElementById(id_elt))
	{
		document.getElementById(id_elt).src = url_elt;
	}
}

//********************************************************
//** Permettre de rendre la transparence au png sous ie **
//********************************************************
function IE_CorrectAlpha_PNG(traitement){
	if (traitement != true)
	{
		traitement = false;
	}

	for(i=0; i<document.images.length; i++){
		img    = document.images[i];
		imgExt  = img.src.substring(img.src.length-3, img.src.length);
		imgExt  = imgExt.toUpperCase();
		if (imgExt == "PNG" && (traitement || img.name.substr(0,17) != "pas_de_correction"))
		{
			imgID    = (img.id) ? "id='" + img.id + "' " : "";
			imgClass= (img.className) ? "class='" + img.className + "' " : "";
			imgTitle= (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' ";
			imgStyle= "display:inline-block;" + img.style.cssText;
			if (img.align == "left") {
				imgStyle = "float:left;"  + imgStyle;
			} else if (img.align == "right"){
				imgStyle = "float:right;" + imgStyle;
			}
			if (img.parentElement.href)   {
				imgStyle = "cursor:hand;" + imgStyle;
			}
			strNewHTML		= '<span '+imgID+imgClass+imgTitle+' style="width:'+img.width+'px; height:'+img.height+'px;'+imgStyle+';'+'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''+img.src+'\', sizingMethod=\'scale\');" ><\/span>';
			img.outerHTML	= strNewHTML;
			i = i-1;
		}
	}
	if ( document.all )
	{
		var images_list = document.getElementsByTagName( '*' );
		for ( var i = 0 ; i < images_list.length; i++ )
		{
			var image_name = images_list[ i ].currentStyle.backgroundImage.replace( /url[s]*()+/, '' );
			image_name     = image_name.replace( /(")+/g, '' );
			image_name     = image_name.substr( 1, image_name.length - 1 );
			image_name     = image_name.substr( 0, image_name.length - 1 );
			imgExt         = image_name.toUpperCase();
			imgExt         = imgExt.substring( imgExt.length - 3, imgExt.length )
			if ( imgExt == "PNG" )
			{
				images_list[ i ].runtimeStyle.backgroundImage = "url( './correct_transparent_png.gif' )";
				images_list[ i ].runtimeStyle.filter          = "progid:DXImageTransform.Microsoft.AlphaImageLoader( src='" + image_name + "', sizingMethod='scale' )";
			}
		}
	}

	return true;
}

var arVersion = navigator.appVersion.split("MSIE")
if (typeof arVersion[1] != "undefined")
{
	var version = parseFloat(arVersion[1])
	var is_msie = ((version >= 5.5) && (version < 7));
	if ( is_msie )
	{
		window.attachEvent("onload", IE_CorrectAlpha_PNG);
	}
}

/* Ecrire cookie*/
function EcrireCookie(nom, valeur, expires, path, domain, secure)
{
	expires = (expires == undefined ? null:expires);
	path = (path == undefined ? null:path);
	domain = (domain == undefined ? null:domain);
	secure = (secure == undefined ? null:secure);

	if (expires != null)
	{
		var exdate=new Date();
		exdate.setDate(exdate.getDate()+expires);
	}

	document.cookie=nom+"="+escape(valeur)+
	((expires==null) ? "" : ("; expires="+exdate.toGMTString()))+
	((path==null) ? "" : ("; path="+path))+
	((domain==null) ? "" : ("; domain="+domain))+
	((secure==true) ? "; secure" : "");
}

/* Ecrire cookie avec données multiples sans : ni ; */
function EcrireMultiCookies(nomcookie, nom, valeur )
{
	var Kws_Test = LireCookie(nomcookie);
	var Kws_NomVal;
	var Kws_Nom;
	var Kws_NewValeur = '';
	var Kws_FindNom = false;
	if(Kws_Test==null) Kws_NewValeur = nom+':'+valeur;
	else
	{
		Kws_NomVal = Kws_Test.split(';');
		for (var i=0 ; i < Kws_NomVal.length; i++)
		{
			Kws_Nom = Kws_NomVal[i].split(':')
			if (Kws_Nom[0] == nom)
			{
				Kws_Nom[1] = valeur;
				Kws_FindNom = true;
			}
			Kws_NewValeur += (i==0 ? '':';')+Kws_Nom[0]+':'+Kws_Nom[1];
		}
		if (!Kws_FindNom)
		{
			Kws_NewValeur += ';'+nom+':'+valeur;
		}
	}
	EcrireCookie(nomcookie, Kws_NewValeur);
}

/* Ecrire display simplifié ds cookie */
function EcrireDisplay(nomcookie, nom, valeur )
{
	if (valeur == 'block') valeur = 1;
	else valeur = 0;

	EcrireMultiCookies(nomcookie, nom, valeur);
}

/* Lire cookie */
function getCookieVal(offset)
{
	var endstr=document.cookie.indexOf (";", offset);
	if (endstr==-1) endstr=document.cookie.length;
	return unescape(document.cookie.substring(offset, endstr));
}

function LireCookie(nom)
{
	var arg=nom+"=";
	var alen=arg.length;
	var clen=document.cookie.length;
	var i=0;
	while (i<clen)
	{
		var j=i+alen;
		if (document.cookie.substring(i, j)==arg) return getCookieVal(j);
		i=document.cookie.indexOf(" ",i)+1;
		if (i==0) break;
	}
	return null;
}

/* Effacer cookie */
function EffaceCookie(nom, path)
{
	path = (path == undefined ? null:path);
	EcrireCookie(nom,null,-365,path);
}

/************************************/
/* COOKIE D'EXISTENCE DU JAVASCRIPT */
/************************************/
/* EcrireCookie("K_JS", "1"); */


/**********************/
/* TRANSPARENCE IMAGE */
/**********************/
function makevisible( id , valeur)
{
	document.getElementById("pic_" + id).style.opacity = valeur;
	document.getElementById("pic_" + id).style.filter = "alpha(opacity=" + ( valeur * 100 ) + ")";
}

/*
 * © 2008 - Michel Petit <petit.michel@gmail.com>
 * http://michel.petit9.free.fr/article/appeler-javascript-avec-parametres-dans-url/
 */

var ParseScriptParam = function(basename)
{
	this.basename        = basename;
	this.paramsAvailable = false;
	this.count           = 0;
	this.params          = new Object();

	this.hasParam = function(key)
	{
		if(this.params[key])	return true;
		else					return false;
	}

	this.parse = function()
	{
		var src;
		var re		= new RegExp(this.basename + '.js\?.+');
		var scripts	= document.getElementsByTagName('script');

		for(var i = 0; i < scripts.length; i++)
		{
			src = scripts[i].getAttribute('src');
			if(src != null && re.test(src))
			{
				if(src.indexOf('?') > 0)
				{
					var splitURL = src.split('?');
					var params   = splitURL[1].split('&');
					var keyValue = new Array();
					if(splitURL[1].length > 0)
					{
						this.paramsAvailable = true;
						this.count = params.length;
					}
					if(this.count > 0)
					{
						for(var j = 0; j < this.count; j++)
						{
							keyValue = params[j].split('=');
							this.params[keyValue[0]] = decodeURIComponent(keyValue[1]);
						}
					}
					else
					{
						this.params[splitURL[1]] = '';
					}
				}
			}
		}
	}
}
