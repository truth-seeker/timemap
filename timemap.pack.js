/* 
 * Timemap.js Copyright 2008 Nick Rabinowitz.
 * Licensed under the MIT License (see LICENSE.txt)
 */
(function(){var j=this,g,h=j.Timeline,i=h.DateTime,d=j.jQuery,q=j.mxn,s=q.Mapstraction,c=q.LatLonPoint,a=q.BoundingBox,f=q.Marker,o=q.Polyline,r="itemsloaded",k="http://www.google.com/intl/en_us/mapfiles/ms/icons/",l,p,n,m,e;l=function(u,w,v){var t=this,x={mapCenter:new c(0,0),mapZoom:0,mapType:"physical",showMapTypeCtrl:true,showMapCtrl:true,syncBands:true,mapFilter:"hidePastFuture",centerOnItems:true,theme:"red",dateParser:"hybrid",checkResize:true,selected:-1};t.mElement=w;t.tElement=u;t.datasets={};t.chains={};t.opts=v=d.extend(x,v);v.mapType=b.lookup(v.mapType,l.mapTypes);v.mapFilter=b.lookup(v.mapFilter,l.filters);v.theme=m.create(v.theme,v);t.initMap()};l.version="2.0";var b=l.util={};l.init=function(v){var C="TimeMap.init: Either %Id or %Selector is required",B={options:{},datasets:[],bands:false,bandInfo:false,bandIntervals:"wk",scrollTo:"earliest"},t=l.state,F,I,D=[],G,y,A,u,z=[],w;v.mapSelector=v.mapSelector||"#"+v.mapId;v.timelineSelector=v.timelineSelector||"#"+v.timelineId;if(t){t.setConfigFromUrl(v)}v=d.extend(B,v);if(!v.bandInfo&&!v.bands){F=b.lookup(v.bandIntervals,l.intervals);v.bandInfo=[{width:"80%",intervalUnit:F[0],intervalPixels:70},{width:"20%",intervalUnit:F[1],intervalPixels:100,showEventText:false,overview:true,trackHeight:0.4,trackGap:0.2}]}I=new l(d(v.timelineSelector).get(0),d(v.mapSelector).get(0),v.options);v.datasets.forEach(function(K,J){y=d.extend({title:K.title,theme:K.theme,dateParser:K.dateParser},K.options);u=K.id||"ds"+J;D[J]=I.createDataset(u,y);if(J>0){D[J].eventSource=D[0].eventSource}});I.eventSource=D[0].eventSource;w=(D[0]&&D[0].eventSource)||new h.DefaultEventSource();if(v.bands){v.bands.forEach(function(x){if(x.eventSource!==null){x.eventSource=w}})}else{v.bandInfo.forEach(function(K,J){if(!(("eventSource" in K)&&!K.eventSource)){K.eventSource=w}else{K.eventSource=null}z[J]=h.createBandInfo(K);if(J>0&&b.TimelineVersion()=="1.2"){z[J].eventPainter.setLayout(z[0].eventPainter.getLayout())}})}I.initTimeline(z);var E=l.loadManager,H=function(){E.increment()};E.init(I,v.datasets.length,v);v.datasets.forEach(function(P,K){var Q=D[K],M=P.data||P.options||{},O=P.type||M.type,N=(typeof O=="string")?l.loaders[O]:O,J=new N(M);J.load(Q,H)});return I};l.prototype={initMap:function(){var t=this,u=t.opts,w,v;t.map=w=new s(t.mElement,u.mapProvider);w.setCenterAndZoom(u.mapCenter,u.mapZoom);w.addControls({pan:u.showMapCtrl,zoom:u.showMapCtrl?"large":false,map_type:u.showMapTypeCtrl});w.setMapType(u.mapType);t.getNativeMap=function(){return w.getMap()};t.mapBounds=u.mapZoom>0?w.getBounds():new a()},initTimeline:function(w){var C=this,B,u=C.opts,D=function(x){return x.visible},v=function(x){return x.dataset.visible},y=function(E,G,F){F.item.openInfoWindow()},t,A,z;for(A=1;A<w.length;A++){if(u.syncBands){w[A].syncWith=0}w[A].highlight=true}C.timeline=B=h.create(C.tElement,w);for(A=0;A<B.getBandCount();A++){z=B.getBand(A).getEventPainter().constructor;z.prototype._showBubble=y}C.addFilterChain("map",function(x){x.showPlacemark()},function(x){x.hidePlacemark()},null,null,[D,v]);if(u.mapFilter){C.addFilter("map",u.mapFilter);B.getBand(0).addOnScrollListener(function(){C.filter("map")})}C.addFilterChain("timeline",function(x){x.showEvent()},function(x){x.hideEvent()},null,function(){C.eventSource._events._index();B.layout()},[D,v]);if(u.timelineFilter){C.addFilter("map",u.timelineFilter)}if(u.checkResize){j.onresize=function(){if(!t){t=j.setTimeout(function(){t=null;B.layout()},500)}}}},parseDate:function(t){var v=new Date(),u=this.eventSource,x=l.dateParsers.hybrid,w=u.getCount()>0?true:false;switch(t){case"now":break;case"earliest":case"first":if(w){v=u.getEarliestDate()}break;case"latest":case"last":if(w){v=u.getLatestDate()}break;default:v=x(t)}return v},scrollToDate:function(z,A,y){var G=this.timeline,u=G.getBand(0),D,v,E=[],F,w,t;z=this.parseDate(z);if(z){v=z.getTime();for(D=0;D<G.getBandCount();D++){F=G.getBand(D);w=F.getMinDate().getTime();t=F.getMaxDate().getTime();E[D]=(A&&v>w&&v<t)}if(y){var C=b.TimelineVersion()=="1.2"?h:SimileAjax,B=C.Graphics.createAnimation(function(x,H){u.setCenterVisibleDate(new Date(x))},u.getCenterVisibleDate().getTime(),v,1000);B.run()}else{u.setCenterVisibleDate(z)}for(D=0;D<E.length;D++){if(E[D]){G.getBand(D).layout()}}}else{if(A){G.layout()}}},createDataset:function(y,u){var t=this,x=new n(t,u);t.datasets[y]=x;if(t.opts.centerOnItems){var w=t.map,v=t.mapBounds;d(x).bind(r,function(){if(!v.isEmpty()){w.setBounds(v)}})}return x},each:function(u){var t=this,v;for(v in t.datasets){if(t.datasets.hasOwnProperty(v)){u(t.datasets[v])}}},eachItem:function(t){this.each(function(u){u.each(function(v){t(v)})})},getItems:function(){var t=[];this.each(function(u){t=t.concat(u.items)});return t},getIndex:function(t){return this.getItems().indexOf(t)},setSelected:function(t){this.opts.selected=this.getIndex(t)},getSelected:function(){return this.opts.selected},filter:function(u){var t=this.chains[u];if(t){t.run()}},addFilterChain:function(x,u,t,y,w,v){this.chains[x]=new p(this,u,t,y,w,v)},removeFilterChain:function(t){delete this.chains[t]},addFilter:function(u,v){var t=this.chains[u];if(t){t.add(v)}},removeFilter:function(u,v){var t=this.chains[u];if(t){t.remove(v)}}};l.loadManager=new function(){var t=this;t.init=function(u,w,v){t.count=0;t.tm=u;t.target=w;t.opts=v||{}};t.increment=function(){t.count++;if(t.count>=t.target){t.complete()}};t.complete=function(){var u=t.tm,w=t.opts,v=w.dataLoadedFunction;if(v){v(u)}else{u.scrollToDate(w.scrollTo,true);if(u.initState){u.initState()}v=w.dataDisplayedFunction;if(v){v(u)}}}}();l.loaders={cb:{},cancel:function(u){var t=l.loaders.cb;t[u]=function(){delete t[u]}},cancelAll:function(){var t=l.loaders,u=t.cb,v;for(v in u){if(u.hasOwnProperty(v)){t.cancel(v)}}},counter:0,base:function(u){var v=function(w){return w},t=this;t.parse=u.parserFunction||v;t.preload=u.preloadFunction||v;t.transform=u.transformFunction||v;t.scrollTo=u.scrollTo||"earliest";t.getCallbackName=function(y,z){var w=l.loaders.cb,x="_"+l.loaders.counter++;z=z||function(){y.timemap.scrollToDate(t.scrollTo,true)};w[x]=function(A){var B=t.parse(A);B=t.preload(B);y.loadItems(B,t.transform);z();delete w[x]};return x};t.getCallback=function(x,y){var w=t.getCallbackName(x,y);return l.loaders.cb[w]};t.cancel=function(){l.loaders.cancel(t.callbackName)}},basic:function(u){var t=new l.loaders.base(u);t.data=u.items||u.value||[];t.load=function(v,w){(this.getCallback(v,w))(this.data)};return t},remote:function(u){var t=new l.loaders.base(u);t.opts=d.extend({},u,{type:"GET",dataType:"text"});t.load=function(v,w){t.callbackName=t.getCallbackName(v,w);t.opts.success=l.loaders.cb[t.callbackName];d.ajax(t.opts)};return t}};p=function(v,u,t,A,x,w){var y=this,z=d.noop;y.timemap=v;y.chain=w||[];y.on=u||z;y.off=t||z;y.pre=A||z;y.post=x||z};p.prototype={add:function(t){return this.chain.push(t)},remove:function(v){var u=this.chain,t=v?u.indexOf(v):u.length-1;return u.splice(t,1)},run:function(){var u=this,t=u.chain;if(!t.length){return}u.pre();u.timemap.eachItem(function(x){var v,w=t.length;L:while(!v){while(w--){if(!t[w](x)){u.off(x);break L}}u.on(x);v=true}});u.post()}};l.filters={hidePastFuture:function(w){var y=w.timeline.getBand(0),u=y.getMaxVisibleDate().getTime(),v=y.getMinVisibleDate().getTime(),t=w.getStartTime(),x=w.getEndTime();if(t!==g){return t<u&&(x>v||t>v)}return true},hideFuture:function(v){var u=v.timeline.getBand(0).getMaxVisibleDate().getTime(),t=v.getStartTime();if(t!==g){return t<u}return true},showMomentOnly:function(u){var w=u.timeline.getBand(0),x=w.getCenterVisibleDate().getTime(),t=u.getStartTime(),v=u.getEndTime();if(t!==g){return t<x&&(v>x||t>x)}return true}};n=function(t,u){var v=this;v.timemap=t;v.eventSource=new h.DefaultEventSource();v.items=[];v.visible=true;v.opts=u=d.extend({},t.opts,u);u.dateParser=b.lookup(u.dateParser,l.dateParsers);u.theme=m.create(u.theme,u)};n.prototype={getItems:function(u){var t=this.items;return u===g?t:u in t?t[u]:null},getTitle:function(){return this.opts.title},each:function(t){this.items.forEach(t)},loadItems:function(v,t){var u=this;v.forEach(function(w){u.loadItem(w,t)});d(u).trigger(r)},loadItem:function(w,t){if(t){w=t(w)}if(w){var v=this,u;w.options=d.extend({},v.opts,{title:null},w.options);u=new e(w,v);v.items.push(u);return u}}};m=function(t){var v={color:"#FE766A",lineOpacity:1,lineWeight:2,fillOpacity:0.4,eventTextColor:null,eventIconPath:"timemap/images/",eventIconImage:"red-circle.png",classicTape:false,icon:k+"red-dot.png",iconSize:[32,32],iconShadow:k+"msmarker.shadow.png",iconShadowSize:[59,32],iconAnchor:[16,33]};var u=d.extend(v,t);v={lineColor:u.color,fillColor:u.color,eventColor:u.color,eventIcon:u.eventIcon||u.eventIconPath+u.eventIconImage};return d.extend(v,u)};m.create=function(v,t){v=b.lookup(v,l.themes);if(!v){return new m(t)}if(t){var w=false,u;for(u in t){if(v.hasOwnProperty(u)){w={};break}}if(w){for(u in v){if(v.hasOwnProperty(u)){w[u]=t[u]||v[u]}}w.eventIcon=t.eventIcon||w.eventIconPath+w.eventIconImage;return w}}return v};e=function(P,G){var N=this,z=d.extend({type:"none",description:"",infoPoint:null,infoHtml:"",infoUrl:"",openInfoWindow:P.options.infoUrl?e.openInfoWindowAjax:e.openInfoWindowBasic,infoTemplate:'<div class="infotitle">{{title}}</div><div class="infodescription">{{description}}</div>',templatePattern:/\{\{([^}]+)\}\}/g,closeInfoWindow:e.closeInfoWindowBasic},P.options),x=G.timemap,O=z.theme=m.create(z.theme,z),w=z.dateParser,F=h.DefaultEventSource.Event,C=P.start,A=P.end,u=O.eventIcon,B=O.eventTextColor,Q=z.title=P.title||"Untitled",K=null,v,D=x.mapBounds,E=[],I=[],t=null,y="",J=null,M;N.dataset=G;N.map=x.map;N.timeline=x.timeline;N.opts=z;C=C?w(C):null;A=A?w(A):null;v=!A;if(C!==null){if(b.TimelineVersion()=="1.2"){K=new F(C,A,null,null,v,Q,null,null,null,u,O.eventColor,O.eventTextColor)}else{if(!B){B=(O.classicTape&&!v)?"#FFFFFF":"#000000"}K=new F({start:C,end:A,instant:v,text:Q,icon:u,color:O.eventColor,textColor:B})}K.item=N;if(!z.noEventLoad){G.eventSource.add(K)}}N.event=K;function H(V){var U=null,X="",aa=null,ad;if(V.point){var W=V.point.lat,R=V.point.lon;if(W===g||R===g){return U}aa=new c(parseFloat(W),parseFloat(R));if(z.centerOnItems){D.extend(aa)}U=new f(aa);U.setLabel(V.title);U.addData(O);X="marker"}else{if(V.polyline||V.polygon){var ab=[],S="polygon" in V,ac=V.polyline||V.polygon,Y;ad=new a();if(ac&&ac.length){for(Y=0;Y<ac.length;Y++){aa=new c(parseFloat(ac[Y].lat),parseFloat(ac[Y].lon));ab.push(aa);ad.extend(aa)}if(z.centerOnItems){D.extend(ad.getNorthEast());D.extend(ad.getSouthWest())}U=new o(ab);U.addData({color:O.lineColor,width:O.lineWeight,opacity:O.lineOpacity,closed:S,fillColor:O.fillColor,fillOpacity:O.fillOpacity});X=S?"polygon":"polyline";aa=S?ad.getCenter():ab[Math.floor(ab.length/2)]}}else{if("overlay" in V){var Z=new c(parseFloat(V.overlay.south),parseFloat(V.overlay.west)),T=new c(parseFloat(V.overlay.north),parseFloat(V.overlay.east));ad=new a(Z.lat,Z.lon,T.lat,T.lon);if(x.opts.centerOnItems){D.extend(Z);D.extend(T)}x.map.addImageOverlay("img"+(new Date()).getTime(),V.overlay.image,O.lineOpacity,Z.lon,Z.lat,T.lon,T.lat);X="overlay";aa=ad.getCenter()}}}return{placemark:U,type:X,point:aa}}if("placemarks" in P){I=P.placemarks}else{["point","polyline","polygon","overlay"].forEach(function(R){if(R in P){t={};t[R]=P[R];I.push(t)}})}I.forEach(function(S){S.title=S.title||Q;var R=H(S);if(R){J=J||R.point;y=y||R.type;if(R.placemark){E.push(R.placemark)}}});z.type=E.length>1?"array":y;z.infoPoint=z.infoPoint?new c(parseFloat(z.infoPoint.lat),parseFloat(z.infoPoint.lon)):J;E.forEach(function(R){R.item=N;R.click.addHandler(function(){N.openInfoWindow()});if(!z.noPlacemarkLoad){if(b.getPlacemarkType(R)=="marker"){x.map.addMarker(R)}else{x.map.addPolyline(R)}R.hide()}});N.placemark=E.length==1?E[0]:E.length?E:null;N.getNativePlacemark=function(){var R=N.placemark;return R&&(R.proprietary_marker||R.proprietary_polyline)};N.getType=function(){return z.type};N.getTitle=function(){return z.title};N.getInfoPoint=function(){return z.infoPoint||N.map.getCenter()};N.getStart=function(){return N.event?N.event.getStart():null};N.getEnd=function(){return N.event?N.event.getEnd():null};N.getStartTime=function(){var R=N.getStart();if(R){return R.getTime()}};N.getEndTime=function(){var R=N.getEnd();if(R){return R.getTime()}};N.isSelected=function(){return x.getSelected()==x.getIndex(N)};N.visible=true;N.placemarkVisible=false;N.eventVisible=true;N.openInfoWindow=function(){z.openInfoWindow.call(N);x.setSelected(N)};N.closeInfoWindow=function(){z.closeInfoWindow.call(N);x.setSelected(null)}};e.prototype={showPlacemark:function(){var t=this,u=function(v){v.show()};if(t.placemark&&!t.placemarkVisible){if(t.getType()=="array"){t.placemark.forEach(u)}else{u(t.placemark)}t.placemarkVisible=true}},hidePlacemark:function(){var t=this,u=function(v){v.hide()};if(t.placemark&&t.placemarkVisible){if(t.getType()=="array"){t.placemark.forEach(u)}else{u(t.placemark)}t.placemarkVisible=false}t.closeInfoWindow()},showEvent:function(){var u=this,t=u.event;if(t&&!u.eventVisible){u.timeline.getBand(0).getEventSource()._events._events.add(t);u.eventVisible=true}},hideEvent:function(){var u=this,t=u.event;if(t&&u.eventVisible){u.timeline.getBand(0).getEventSource()._events._events.remove(t);u.eventVisible=false}},scrollToStart:function(u){var t=this;if(t.event){t.dataset.timemap.scrollToDate(t.getStart(),false,u)}}};e.openInfoWindowBasic=function(){var w=this,v=w.opts,u=v.infoHtml,t;if(!u){u=v.infoTemplate;t=v.templatePattern.exec(u);while(t){u=u.replace(t[0],v[t[1]]);t=v.templatePattern.exec(u)}v.infoHtml=u}if(w.placemark&&!w.placemarkVisible&&w.event){w.dataset.timemap.scrollToDate(w.event.getStart())}if(w.getType()=="marker"){w.placemark.setInfoBubble(u);w.placemark.openBubble();w.closeHandler=w.placemark.closeInfoBubble.addHandler(function(){w.dataset.timemap.setSelected(null);w.placemark.closeInfoBubble.removeHandler(w.closeHandler)})}else{w.map.openBubble(w.getInfoPoint(),u);w.map.tmBubbleItem=w}};e.openInfoWindowAjax=function(){var t=this;if(!t.opts.infoHtml&&t.opts.infoUrl){d.get(t.opts.infoUrl,function(u){t.opts.infoHtml=u;t.openInfoWindow()});return}t.openInfoWindow=function(){e.openInfoWindowBasic.call(t);t.dataset.timemap.setSelected(t)};t.openInfoWindow()};e.closeInfoWindowBasic=function(){var t=this;if(t.getType()=="marker"){t.placemark.closeBubble()}else{if(t==t.map.tmBubbleItem){t.map.closeBubble();t.map.tmBubbleItem=null}}};l.util.getTagValue=function(v,t,u){return b.getNodeList(v,t,u).first().text()};l.util.nsMap={};l.util.getNodeList=function(w,u,v){var t=l.util.nsMap;w=w.jquery?w[0]:w;return !w?d():!v?d(u,w):(w.getElementsByTagNameNS&&t[v])?d(w.getElementsByTagNameNS(t[v],u)):d(w.getElementsByTagName(v+":"+u))};l.util.makePoint=function(u,v){var t=null;if(u.lat&&u.lng){t=[u.lat(),u.lng()]}if(d.type(u)=="array"){t=u}if(!t){u=d.trim(u);if(u.indexOf(",")>-1){t=u.split(",")}else{t=u.split(/[\r\n\f ]+/)}}if(t.length>2){t=t.slice(0,2)}if(v){t.reverse()}return{lat:d.trim(t[0]),lon:d.trim(t[1])}};l.util.makePoly=function(w,z){var v=[],u,t,y=d.trim(w).split(/[\r\n\f ]+/);for(t=0;t<y.length;t++){u=(y[t].indexOf(",")>0)?y[t].split(","):[y[t],y[++t]];if(u.length>2){u=u.slice(0,2)}if(z){u.reverse()}v.push({lat:u[0],lon:u[1]})}return v};l.util.formatDate=function(z,y){y=y||3;var A="";if(z){var x=z.getUTCFullYear(),u=z.getUTCMonth(),B=z.getUTCDate();if(x<1000){return(x<1?(x*-1+"BC"):x+"")}if(z.toISOString&&y==3){return z.toISOString()}var t=function(D){return((D<10)?"0":"")+D};A+=x+"-"+t(u+1)+"-"+t(B);if(y>1){var v=z.getUTCHours(),w=z.getUTCMinutes(),C=z.getUTCSeconds();A+="T"+t(v)+":"+t(w);if(y>2){A+=t(C)}A+="Z"}}return A};l.util.TimelineVersion=function(){return h.version||(h.DurationEventPainter?"1.2":"2.2.0")};l.util.getPlacemarkType=function(t){return t.constructor==f?"marker":t.constructor==o?(t.closed?"polygon":"polyline"):false};l.util.lookup=function(t,u){return typeof t=="string"?u[t]:t};if(!([].indexOf)){Array.prototype.indexOf=function(v){var t=this,u=t.length;while(--u){if(t[u]===v){break}}return u}}if(!([].forEach)){Array.prototype.forEach=function(v){var t=this,u;for(u=0;u<t.length;u++){if(u in t){v(t[u],u,t)}}}}l.intervals={sec:[i.SECOND,i.MINUTE],min:[i.MINUTE,i.HOUR],hr:[i.HOUR,i.DAY],day:[i.DAY,i.WEEK],wk:[i.WEEK,i.MONTH],mon:[i.MONTH,i.YEAR],yr:[i.YEAR,i.DECADE],dec:[i.DECADE,i.CENTURY]};l.mapTypes={normal:s.ROAD,satellite:s.SATELLITE,hybrid:s.HYBRID,physical:s.PHYSICAL};l.dateParsers={gregorian:function(u){if(!u||typeof u!="string"){return null}var v=Boolean(u.match(/b\.?c\.?/i)),t=parseInt(u,10),w;if(!isNaN(t)){if(v){t=1-t}w=new Date(0);w.setUTCFullYear(t);return w}else{return null}},hybrid:function(u){if(u instanceof Date){return u}var t=l.dateParsers,w=new Date(typeof u=="number"?u:Date.parse(t.fixChromeBug(u)));if(isNaN(w)){if(typeof u=="string"){if(u.match(/^-?\d{1,6} ?(a\.?d\.?|b\.?c\.?e?\.?|c\.?e\.?)?$/i)){w=t.gregorian(u)}else{try{w=t.iso8601(u)}catch(v){w=null}}if(!w&&u.match(/^\d{7,}$/)){w=new Date(parseInt(u,10))}}else{return null}}return w},iso8601:i.parseIso8601DateTime,fixChromeBug:function(t){return Date.parse("-200")==Date.parse("200")?(typeof t=="string"&&t.substr(0,1)=="-"?null:t):t}};l.themes={red:new m(),blue:new m({icon:k+"blue-dot.png",color:"#5A7ACF",eventIconImage:"blue-circle.png"}),green:new m({icon:k+"green-dot.png",color:"#19CF54",eventIconImage:"green-circle.png"}),ltblue:new m({icon:k+"ltblue-dot.png",color:"#5ACFCF",eventIconImage:"ltblue-circle.png"}),purple:new m({icon:k+"purple-dot.png",color:"#8E67FD",eventIconImage:"purple-circle.png"}),orange:new m({icon:k+"orange-dot.png",color:"#FF9900",eventIconImage:"orange-circle.png"}),yellow:new m({icon:k+"yellow-dot.png",color:"#ECE64A",eventIconImage:"yellow-circle.png"}),pink:new m({icon:k+"pink-dot.png",color:"#E14E9D",eventIconImage:"pink-circle.png"})};j.TimeMap=l;j.TimeMapFilterChain=p;j.TimeMapDataset=n;j.TimeMapTheme=m;j.TimeMapItem=e})();