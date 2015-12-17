/**
 * Created by abuhena on 12/10/15.
 */

var kPlayer = {};

kPlayer.context = null,
    kPlayer.video = null,
    kPlayer.touchableContext = null,
    kPlayer.titleContext = null;
    kPlayer.noiseContext = null,
    kPlayer.controlContext = null,
    kPlayer.videoContext = null,
    kPlayer.bufferLoaderContext = null,
    kPlayer.timeTitleContext = null,
    kPlayer.aboutContext = null,
    kPlayer.contextMenu = null,
    kPlayer.fullscreen = false,
    kPlayer.contextWidth = 640,
    kPlayer.contextHeight = 360,
    kPlayer.playBtnContext = null,
    kPlayer.pauseBtnContext = null,
    kPlayer.seekBarContext = null,
    kPlayer.d = document,
    kPlayer.title = "",
    kPlayer.textColor = "#EEEDED",
    kPlayer.font_family = "'Roboto', sans-serif",
    kPlayer.timeout = null,
    kPlayer.volTimeout = null,
    kPlayer.ppTimeout = null,
    kPlayer.currentVol = 100;

    kPlayer.construct = function ()
    {
        this.loadCDN('https://cdn.jsdelivr.net/animatecss/3.4.0/animate.min.css', 'css');
        this.loadCDN('https://fonts.googleapis.com/css?family=Roboto', 'css');
        this.loadCDN('extras/style.css', 'css');
        this.loadCDN('https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css', 'css');
        //this.loadCDN('https://cdnjs.cloudflare.com/ajax/libs/datejs/1.0/date.min.js', 'js');
        this.loadCDN('extras/date.js', 'js');

        return this.createContexts();
    }

    kPlayer.createContexts = function()
    {
        /** Main Context **/
        this.context = this.find("kplayer-main");
        this.context.style.width = this.contextWidth+"px";
        this.context.style.height = this.contextHeight+"px";
        this.context.style.backgroundColor = "#000";
        this.context.style.color = this.textColor;
        this.context.style.fontFamily = this.font_family;


        /** Create Video Context **/
        this.videoContext = this.d.createElement("video");
        this.videoContext.src = this.context.getAttribute("src");
        if (this.context.getAttribute("autoplay"))
        {
            this.videoContext.autoplay;
        }
        this.videoContext.preload = true;
        this.videoContext.poster = this.context.getAttribute("poster") || '';
        this.videoContext.className = "video-component";
        this.videoContext.style.width = this.contextWidth+"px";
        this.videoContext.style.height = this.contextHeight+"px";

        this.title = this.context.getAttribute("title") || 'A Simple Title';

        this.context.appendChild(this.videoContext);

        this.video = this.find("video-component");



        /*** Buffer Loader Context ***/
        this.bufferLoaderContext = this.d.createElement("div");
        this.bufferLoaderContext.style.height = this.contextHeight+"px";
        this.bufferLoaderContext.style.width = this.contextWidth+"px";
        this.bufferLoaderContext.className = "kp-bufferLoader";
        this.bufferLoaderContext.style.display = "none";

        this.context.appendChild(this.bufferLoaderContext);

        this.bufferLoaderContext.innerHTML = '<div style="margin-top: 25%;" class="cssload-spin-box"></div>';

        /** Create Noise context **/
        this.noiseContext = this.d.createElement("div");
        this.noiseContext.style.width = this.contextWidth+"px";
        this.noiseContext.style.height = this.contextHeight+"px";
        this.noiseContext.style.display = "none";
        this.noiseContext.className = "kp-noise-screen";

        this.context.appendChild(this.noiseContext);

        /** Create Control context **/
        this.controlContext = this.d.createElement("div");
        this.controlContext.className = "kp-player-control slideInUp animated";
        this.controlContext.style.width = this.contextWidth+"px";
        this.controlContext.style.height = "60px";
        this.controlContext.style.position = "absolute";
        this.controlContext.style.backgroundImage = "linear-gradient(to bottom, rgba(33,32,32,0.0), rgba(33,32,32, 0.55))";
        this.controlContext.style.left = "0px";
        /*this.controlContext.style.top = (parseInt(this.context.style.height.replace("px", "")) -
            parseInt(this.controlContext.style.height.replace("px", "")) )+"px";*/
        this.controlContext.style.right = "0px";
        this.controlContext.style.bottom = "0px";

        this.context.appendChild(this.controlContext);
        this.controlContext.innerHTML = '<div class="kp-progress-bar-x" style="width: '+(this.contextWidth - 26)+'px;">'+
            '<div class="kp-progress-x" style="width: '+(this.contextWidth - 26)+'px;">'+
            '<div class="kp-bufferBar"></div>'+
            '<div class="kp-timeBar"></div>'+
            '</div>'+
            '</div>'+
            '<div class="kp-control-down">'+
            '<span style="width: 20px;" class="fa fa-pause kp-fa-btn kp-hide"></span>'+
            '<span style="width: 20px;" class="fa fa-play kp-fa-btn"></span>'+
            '<span class="kp-duration">00:00/00:00</span>'+
            '<div class="right">' +
            '<span class="fa fa-volume-up kp-fa-btn bounceIn animated"> </span>'+
            '<span class="fa fa-volume-off kp-fa-btn bounceIn animated  kp-hide"></span>'+
            '<span style="text-align: right;" class="fa fa-television kp-fa-btn bounceIn animated"></span>'
            '</div></div>';

        this.seekBarContext = this.find("kp-progress-x");
        this.playBtnContext = this.find("fa-play");
        this.pauseBtnContext = this.find("fa-pause");

        /** Create Title context **/
        this.titleContext = this.d.createElement("div");
        this.titleContext.className = "slideInDown animated";
        this.titleContext.style.width = "100%";
        this.titleContext.style.height = "30px";
        this.titleContext.style.position = "absolute";
        this.titleContext.style.backgroundImage = "linear-gradient(to bottom, rgba(33,32,32, 0.65), rgba(33,32,32,0.0))";
        this.titleContext.style.left = "0px";
        this.titleContext.style.right = "0px";
        this.titleContext.style.top = "0px";
        this.titleContext.style.paddingLeft = "20px";
        //this.titleContext.style.paddingBottom = "5px";
        this.titleContext.style.paddingTop = "5px";
        this.titleContext.style.color = this.textColor;
        this.titleContext.style.fontFamily = this.font_family;
        this.titleContext.style.fontSize = "18px";
        this.titleContext.style.textAlign = "left";
        this.titleContext.style.zIndex = 2147483651;
        var title = this.d.createTextNode(this.title);

        this.titleContext.appendChild(title);
        this.context.appendChild(this.titleContext);

        /** Create Touchable context **/
        this.touchableContext = this.d.createElement("div");
        this.touchableContext.style.width = this.contextWidth+"px";
        this.touchableContext.style.height = (this.contextHeight -
        parseInt(this.titleContext.style.height.replace("px", "")) -
            parseInt(this.controlContext.style.height.replace("px", "")))+"px";
        this.touchableContext.style.top = this.titleContext.style.height;
        this.touchableContext.style.left = "0px";
        this.touchableContext.style.position = "absolute";
        this.touchableContext.style.textAlign = "center";
        this.touchableContext.style.zIndex = "2147483647";

        this.context.appendChild(this.touchableContext);

        this.touchableContext.innerHTML = '<span ' +
            'style="color: rgba(255, 255, 255, 0.7); font-size: 75px; display: none;margin-top: 115px;"'+
            'class="fa fa-pause big-pause-btn"></span>'+
            '<span style="color: rgba(255, 255, 255, 0.7);font-size: 75px; display: none;margin-top: 115px;"'+
        'class="fa fa-play big-play-btn"></span>'+
        '<span style="display: none; color: rgba(255, 255, 255, 0.7); margin-top: 115px;"'+
            ' class="kp-vol-text"><span class="fa fa-volume-up">'+
            '</span><span class="kp-now-vol"> 0%</span></span>';

        /** Create Context Menu context **/
        this.contextMenu = this.d.createElement("section");
        this.contextMenu.style.display = "none";
        this.contextMenu.className = "kp-context-menu";
        this.contextMenu.innerHTML = '<div class="kp-cm-list" onclick="copyURL()">Copy Video URL</div>'+
        '<div class="kp-cm-list">Copy embed code</div>'+
        '<div style="border-bottom: none;" onclick="kPlayer.about(true)" class="kp-cm-list">About Kaliver Player</div>';


        this.context.appendChild(this.contextMenu);

        /** Create Top level about popup context **/
        this.aboutContext = this.d.createElement("section");
        this.aboutContext.style.left = "0px";
        this.aboutContext.style.top = "0px";
        this.aboutContext.style.display = "none";
        this.aboutContext.className = "kp-about bounceIn animated";
        this.aboutContext.innerHTML = '<i onclick="kPlayer.debout()" class="fa fa-times" style="color: #D0CFCF; font-size: 18px; margin: 5px; cursor: pointer;"></i>'+
            '<p style="font-weight: bold; text-align: center;"> Kaliver Player v 0.0.1</p>'+

            '<p style="font-size: 12px; margin-left: 30px; color: #D5D3D3;">'+
            'Kaliver Player offers you the best light-weight quality of HTML5 Player with'+
            'high stability of Video Playback. Supported by latest Chrome and FireFox browser as well'+
            'as it supports HLS and H.264 streaming<br/><br/>'+
            'kPlayer is most efficient HTML5 video player for AngularJS and usecase is simple as'+
            'typical directive.<br/><br/>'+
            'Kaliver Player developed and maintained by <span style="font-weight: bold;">Shariar Shaikot</span>'+
            'and always trying to add new features with its stability.'+
            '<span><a style="color: #E1DFDF;" href="https://github.com/abuhena/kPlayer" target="_blank"> Click here</a>'+
            'to contribute </span>'+
            '</p>';

        this.context.appendChild(this.aboutContext);

        /** Create Time Title context **/
        this.timeTitleContext = this.d.createElement("section");
        this.timeTitleContext.style.bottom = this.controlContext.style.height;
        this.timeTitleContext.style.display = "none";
        this.timeTitleContext.className = "kp-time-title";

        this.context.appendChild(this.timeTitleContext);


        return this.bindMouseControls();
    }

    /**
    * @param query
    * @returns {Element}
    */

    kPlayer.find = function (query)
    {
        return document.querySelector("."+query);
    }

    /**
    * @param filename
    * @param filetype
    */

    kPlayer.loadCDN = function (filename, filetype)
    {
        if (filetype=="js")
        {
            var fileref = this.d.createElement('script')
            fileref.setAttribute("type","text/javascript")
            fileref.setAttribute("src", filename)
        }
        else {
            var fileref = this.d.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", filename)
        }
        this.d.getElementsByTagName("head")[0].appendChild(fileref)
    }


/***************** Video Playback Section ******************/

/**
 * Mouse Controls
 */

kPlayer.bindMouseControls = function() {
    var self = this;

    this.playBtnContext.onclick = function()
    {
        self.playBtnContext.className = "fa fa-play kp-fa-btn kp-hide";
        self.pauseBtnContext.className = "fa fa-pause kp-fa-btn bounceIn animated";

        self.video.play();
    }

    this.pauseBtnContext.onclick = function()
    {
        self.video.pause();
    }

    self.find("fa-volume-up").onclick = function()
    {
        self.video.muted = true;
    }

    self.find("fa-volume-off").onclick = function() {
        self.video.muted = false;
    }

    self.touchableContext.onclick = function()
    {
        if (self.video.paused)
        {
            self.playBtnContext.className = "fa fa-play kp-fa-btn kp-hide";
            self.pauseBtnContext.className = "fa fa-pause kp-fa-btn bounceIn animated";

            self.find("big-pause-btn").style.display = "block";
            self.find("big-pause-btn").className = "fa fa-pause zoomOut animated big-pause-btn";
            self.find("big-play-btn").className = "big-play-btn";


            self.video.play();
        }else {

            self.find("big-play-btn").style.display = "block";
            self.find("big-play-btn").className = "fa fa-play zoomOut animated big-play-btn";
            self.find("big-pause-btn").className = "big-pause-btn";

            self.video.pause();
        }
    }

    self.touchableContext.ondblclick = function()
    {
        self.toggleFullscreen(self);
    }
    /** Context Menu popping up **/

    self.context.addEventListener( "contextmenu", function(e) {

        createContextMenu(e, function(element){
            e.preventDefault();
            element.style.display = "block";
        });
    });

    function createContextMenu(e, being)
    {
        var cmElement = self.contextMenu;

        if (!self.fullscreen)
        {
            cmElement.style.top = (e.layerY+5)+"px";
            cmElement.style.left = e.layerX+"px";
        }else {
            cmElement.style.top = (e.pageY+5)+"px";
            cmElement.style.left = e.pageX+"px";
        }

        return being(cmElement);
    }

    self.context.addEventListener("click", function(){
        self.contextMenu.style.display = "none";
    });

    /** ========================== **/

    self.seeking = false;

    self.find("kp-progress-bar-x").onmouseover = function(e)
    {
        //self.activeTime(true, e);
    }

    self.seekBarContext.onmousedown = function(e)
    {
        self.seeking = true;
        self.updateBar(e, self);
    }

    self.seekBarContext.onmouseup = function(e)
    {
        if (self.seeking)
        {
            self.seeking = false;
            self.updateBar(e, self)
        }
    }

    self.seekBarContext.onmousemove = function(e)
    {
        //self.activeTime(true, e);
        if (self.seeking)
        {
            self.updateBar(e, self);
        }
    }

    self.find("kp-progress-bar-x").onmouseout = function(e)
    {
        //self.seeking = false;
        self.activeTime(false, e);
    }

    self.find("fa-television").addEventListener("click", function(){
        self.toggleFullscreen(self);
    });

    document.addEventListener("webkitfullscreenchange", function() {
        self.fsFired(self);
    });

    document.addEventListener("mozfullscreenchange", function() {
        self.fsFired(self);
    });

    this.context.onmouseover = function()
    {
        self.showControls (self);
    }

    this.context.onmouseout = function()
    {
        self.hideControls(self);
    }

    this.context.onmousemove = function()
    {
        self.showControls(self);
    }

    return this.bindVideoEvents(this);
}

/**
 * Hardware Controls
 */

kPlayer.bindHardware = function()
{
    var self = this;
    document.body.onkeyup = function(e)
    {
        switch (e.keyCode)
        {
            case 32:

                if (self.video.paused)
                {
                    self.playBtnContext.className = "fa fa-play kp-fa-btn kp-hide";
                    self.pauseBtnContext.className = "fa fa-pause kp-fa-btn bounceIn animated";

                    self.video.play();
                } else {
                    self.video.pause();
                }

                break;
            case 37:

                self.video.currentTime = self.video.currentTime - 3;

                break;

            case 39:

                self.video.currentTime = self.video.currentTime + 3;

                break;
            case 38:

                self.volumeUp(self);

                break;
            case 40:

                self.volumeDown(self);

                break;
            case 187:

                self.volumeUp(self);

                break;
            case 189:

                self.volumeDown(self);

                break;
        }
    }

    self.context.style.display = "block";
}

/**
 * Event Handlers
 */
kPlayer.bindVideoEvents = function(scope)
{

    this.video.onloadedmetadata = function() {
        scope.find("kp-duration").innerHTML = "00:00/" + (new Date).clearTime()
            .addSeconds(scope.video.duration)
            .toString('mm:ss');

        scope.bufferCheck(scope);
    }

    this.video.onplaying = function()
    {
        scope.playBtnContext.className = "fa fa-play kp-fa-btn kp-hide";
        scope.pauseBtnContext.className = "fa fa-pause kp-fa-btn bounceIn animated";

        setTimeout(function () {
            if (scope.controlContext.className!="kp-player-control slideOutDown animated"&&!scope.video.paused)
            {
                scope.controlContext.className = "kp-player-control slideOutDown animated";
                scope.titleContext.className = "slideOutUp animated";
            }
        }, 3000);

        if (scope.ppTimeout != null) {
            clearTimeout(scope.ppTimeout);
        }

        scope.ppTimeout = setTimeout(function(){

            scope.find("big-play-btn").style.display = "none";
            scope.find("big-pause-btn").style.display = "none";

        }, 500);
    }


    this.video.oncanplay = function()
    {
        scope.noiseContext.style.display = "none";
    }


    this.video.onpause = function()
    {
        scope.controlContext.className = " kp-player-control slideInUp animated";
        scope.titleContext.className = "slideInDown animated";
        scope.playBtnContext.className = "fa fa-play kp-fa-btn bounceIn animated";
        scope.pauseBtnContext.className = "fa fa-pause kp-fa-btn kp-hide";

        if (scope.ppTimeout != null) {
            clearTimeout(scope.ppTimeout);
        }

        scope.ppTimeout = setTimeout(function(){

            scope.find("big-play-btn").style.display = "none";
            scope.find("big-pause-btn").style.display = "none";

        }, 500);
    }


    this.video.onvolumechange = function()
    {
        if (scope.video.muted) {
            scope.find("fa-volume-up").className = "fa fa-volume-up kp-fa-btn bounceIn animated  kp-hide";
            scope.find("fa-volume-off").className = "fa fa-volume-off kp-fa-btn bounceIn animated";
        } else {
            scope.find("fa-volume-up").className = "fa fa-volume-up kp-fa-btn bounceIn animated ";
            scope.find("fa-volume-off").className = "fa fa-volume-off kp-fa-btn bounceIn animated kp-hide";
        }
    }

    this.video.ontimeupdate = function()
    {
        scope.find("kp-duration").innerHTML = (new Date).clearTime()
            .addSeconds(scope.video.currentTime)
            .toString('mm:ss') + "/" + (new Date).clearTime()
                .addSeconds(scope.video.duration)
                .toString('mm:ss');

        var how_percent_has_played = (scope.video.currentTime / scope.video.duration) * 100;
        var getPixel = (parseInt(scope.seekBarContext.style.width.replace("px", "")) / 100) * how_percent_has_played;
        //console.log(scope.seekBarContext);

        scope.find("kp-timeBar").style.width = getPixel+"px";
    }

    this.video.onerror = function(e)
    {
        console.log("Star error " +JSON.stringify(e) +" ...."+ scope.video.error);
        scope.noiseContext.style.display = "block";
    }

    return scope.bindHardware();
}

/**
 * Algorithms
 */
kPlayer.updateBar = function(screen, scope)
{

    scope.find("kp-timeBar").style.width = screen.layerX+"px";

    var seekingToPixel = (scope.find("kp-timeBar").style.width.replace("px", "") /
        parseInt(scope.seekBarContext.style.width.replace("px", ""))) * 100;

    //console.log(seekingToPixel);

    var seekingToTime = (scope.video.duration / 100) * seekingToPixel;


    scope.video.currentTime = seekingToTime;
}

kPlayer.activeTime = function(bool, event) {
    var elem = this.timeTitleContext;
    if (bool) {
        var max_px = parseInt(this.find("kp-progress-bar-x").style.width.replace("px", ""));
        var perc_px = (100 / (max_px)) * (event.layerX);
        var timeTo = (perc_px * this.video.duration) / 100;

        if (perc_px >= 0.005) {
            elem.innerHTML = (new Date).clearTime()
                .addSeconds(timeTo)
                .toString('mm:ss');

            elem.style.display = "block";
            elem.style.left = ((event.layerX) - (parseInt(elem.offsetWidth) / 2)) + "px";
            elem.className = "kp-time-title fadeInUp animated";
        }

    } else {
        elem.className = "kp-time-title fadeOutDown animated";
    }
}

kPlayer.toggleFullscreen = function(scope){

    var element = scope.video;

    if (scope.fullscreen)
    {

        if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else {
            document.webkitCancelFullScreen();
        }

    } else {
        if (element.mozRequestFullScreen) {

            element.mozRequestFullScreen();

        } else if (element.webkitRequestFullScreen) {

            element.webkitRequestFullScreen();

        }
    }

}

kPlayer.fsFired = function(scope)
{
    if (document.webkitFullscreenElement != null || document.mozFullScreenElement != null)
    {
        scope.fullscreen = !scope.fullscreen;

        scope.controlContext.style.zIndex = 2147483651;
        scope.controlContext.style.width = (window.innerWidth - 26)+"px";
        scope.controlContext.style.marginLeft = "10px";
        scope.controlContext.style.marginRight = "10px";
        scope.seekBarContext.style.width = (window.innerWidth - 46) +"px";
        scope.find("kp-progress-bar-x").style.width = (window.innerWidth - 46) +"px";

        /** Touchable content context **/

        scope.touchableContext.style.width = window.innerWidth+"px";

        scope.touchableContext.style.height = (window.innerHeight -
            parseInt(scope.titleContext.style.height.replace("px", "")) -
            parseInt(scope.controlContext.style.height.replace("px", "")))+"px";

        scope.find("big-pause-btn").style.marginTop = ((window.innerHeight -
            parseInt(scope.titleContext.style.height.replace("px", "")) -
            parseInt(scope.controlContext.style.height.replace("px", "")))/2)+"px";

        scope.find("big-play-btn").style.marginTop = ((window.innerHeight -
            parseInt(scope.titleContext.style.height.replace("px", "")) -
            parseInt(scope.controlContext.style.height.replace("px", "")))/2)+"px";

        /** Buffer Loader **/

        scope.bufferLoaderContext.style.width = window.innerWidth +"px";
        scope.bufferLoaderContext.style.height = window.innerHeight +"px";

        scope.find("cssload-spin-box").style.marginTop = "50%";

        /** **/

        this.titleContext.style.paddingTop = "15px";

    } else {
        scope.fullscreen = !scope.fullscreen;
        scope.controlContext.style.width = scope.contextWidth+"px";

        scope.controlContext.style.marginLeft = "0px";
        scope.controlContext.style.marginRight = "0px";
        scope.seekBarContext.style.width = (scope.contextWidth - 26) +"px";
        scope.find("kp-progress-bar-x").style.width = (scope.contextWidth - 26) +"px";

        /** Touchable content context **/
        scope.touchableContext.style.height = (scope.contextHeight -
            parseInt(scope.titleContext.style.height.replace("px", "")) -
            parseInt(scope.controlContext.style.height.replace("px", "")))+"px";

        scope.find("big-pause-btn").style.marginTop = (((scope.contextHeight -
            parseInt(scope.titleContext.style.height.replace("px", "")) -
            parseInt(scope.controlContext.style.height.replace("px", "")))/2) - 20)+"px";

        scope.find("big-play-btn").style.marginTop = (((scope.contextHeight -
            parseInt(scope.titleContext.style.height.replace("px", "")) -
            parseInt(scope.controlContext.style.height.replace("px", "")))/2)-20)+"px";

        scope.touchableContext.style.width = scope.contextWidth+"px";

        /** Buffer Loader **/

        scope.bufferLoaderContext.style.width = scope.contextWidth +"px";
        scope.bufferLoaderContext.style.height = scope.contextHeight +"px";

        scope.find("cssload-spin-box").style.marginTop = "25%";

        /** **/
        this.titleContext.style.paddingTop = "5px";
    }
    scope.resolveSeekBar(scope);
}

kPlayer.showControls = function(scope)
{
    scope.controlContext.className = " kp-player-control slideInUp animated";
    scope.titleContext.className = " slideInDown animated";
    clearTimeout(scope.timeout);
    scope.timeout = setTimeout(function(){

        if (scope.controlContext.className != "kp-player-control slideOutDown animated"&&!scope.video.paused)
        {
            scope.controlContext.className = "kp-player-control slideOutDown animated";
            scope.titleContext.className = "slideOutUp animated";
        }

    }, 5000);
}

kPlayer.hideControls = function(scope)
{
    if (!scope.fullscreen)
    {
        if (!scope.video.paused)
        {
            scope.controlContext.className = " kp-player-control slideOutDown animated";
            scope.titleContext.className = "slideOutUp animated";
        }
    }
}

kPlayer.volumeUp = function(scope)
{

    scope.video.volume = (scope.video.volume + 0.1) > 1 ? 1 : (scope.video.volume + 0.1);
    scope.currentVol += scope.currentVol < 100 ? 10 : 0;
    scope.find("kp-vol-text").style.display = "block";
    scope.find("kp-vol-text").className = "kp-vol-text fadeOut animated";
    scope.find("kp-now-vol").innerHTML = " "+scope.currentVol+"%";
    if (scope.currentVol!=100)
    {

        if (scope.volTimeout!=null) {
            clearTimeout(scope.volTimeout);
        }
        scope.volTimeout = setTimeout(function () {
            scope.find("kp-vol-text").style.display = "none";
            scope.find("kp-vol-text").className = "kp-vol-text";
        }, 500);
    }
}

kPlayer.volumeDown = function(scope)
{
    if (scope.currentVol!=0)
    {
        scope.video.volume = (scope.video.volume - 0.1) < 0.01 ? 0 : (scope.video.volume - 0.1);
        scope.currentVol -= 10;
        scope.find("kp-vol-text").style.display = "block";
        scope.find("kp-vol-text").className = "kp-vol-text fadeOut animated";
        scope.find("kp-now-vol").innerHTML = " "+scope.currentVol+"%";

        if (scope.volTimeout!=null) {
            clearTimeout(scope.volTimeout);
        }
        scope.volTimeout = setTimeout(function () {
            scope.find("kp-vol-text").style.display = "none";
            scope.find("kp-vol-text").className = "kp-vol-text";
        }, 500);
    }
}

kPlayer.about = function()
{
    this.aboutContext.style.display = "block";
    this.aboutContext.style.marginLeft = ((this.touchableContext.offsetWidth - this.aboutContext.offsetWidth) / 2)+"px";
    this.aboutContext.style.marginTop = ((this.touchableContext.offsetHeight - this.aboutContext.offsetHeight) / 2)+"px";
    console.log(this.aboutContext.offsetWidth);
    this.aboutContext.className = "kp-about bounceIn animated";
}

kPlayer.debout = function()
{
    this.aboutContext.className = "kp-about bounceOut animated";
}

kPlayer.resolveSeekBar = function(scope)
{
    var getDurationPerc = ((scope.video.currentTime / scope.video.duration) * 100);
    scope.find("kp-timeBar").style.width = ((scope.seekBarContext.offsetWidth * getDurationPerc) / 100)+"px";
}


kPlayer.currentPlayPos = 0;
kPlayer.checkInterval = 50.0;
kPlayer.lastPlayPos = 0;
kPlayer.bufferingDetected = false;

kPlayer.bufferCheck = function(scope)
{

    setInterval(function() {
        scope.currentPlayPos = scope.video.currentTime

        // checking offset, e.g. 1 / 50ms = 0.02
        var offset = 1 /  scope.checkInterval

        // if no buffering is currently detected,
        // and the position does not seem to increase
        // and the player isn't manually paused...
        if (!scope.bufferingDetected
            && scope.currentPlayPos < (scope.lastPlayPos + offset)
            && !scope.video.paused) {

            console.log("buffering")
            scope.bufferingDetected = true
            scope.bufferLoaderContext.style.display = 'block';

        }

        // if we were buffering but the player has advanced,
        // then there is no buffering
        if (
            scope.bufferingDetected
            && scope.currentPlayPos > (scope.lastPlayPos + offset)
            && !scope.video.paused
        ) {
            scope.bufferingDetected = false
            scope.bufferLoaderContext.style.display = 'none';
        }
        scope.lastPlayPos = scope.currentPlayPos
    }, scope.checkInterval)
}