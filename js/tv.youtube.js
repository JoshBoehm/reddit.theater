/*
 *  youtube singleton oh yeah! 
 */
var youtube = {
    player: null,
    afterLoad: function(){
    	youtube.player = new YT.Player("ytplayer", {events: {onStateChange: youtube.stateListener, onError:errorListener}});
    },

    togglePlay: function(){
	if(youtube.player.getPlayerState() == YT.PlayerState.PLAYING){
		youtube.player.pauseVideo();
	} else {
		youtube.player.playVideo();
	}
    },

    stateListener: function(evt){
	var state = evt.data;
        if(Globals.auto){ //global scope
            if(state === 0){
                loadVideo('next');  //tv.js
            }else if(state === -1){
                youtube.togglePlay();
            }
        }
    },

    errorListener: function(error){
        consoleLog('youtube error received: '+error);
        loadVideo('next');
    },

    createEmbed: function(url){
        var ID, time, hours, minutes, seconds, total_seconds, parts, data = {};

        time = url.match(/(&|&amp;|\?|#)t=([HhMmSs0-9]+)/);
        if(time !== null){
            time = time[2];
            hours = time.match(/(\d+)h/i);
            minutes = time.match(/(\d+)m/i);
            seconds = time.match(/(\d+)s/i);

            total_seconds = hours !== null ? parseInt(hours[1])*60*60 : 0;
            total_seconds += minutes !== null ? parseInt(minutes[1])*60 : 0;
            total_seconds += seconds !== null ? parseInt(seconds[1]) : 0;
        }
        time = total_seconds > 0 ? '&start='+total_seconds : '';

        if(url.match(/(\?v\=|&v\=|&amp;v=)/)){
            parts = url.split('v=');
            ID = parts[1].substr(0,11);
        }else if(url.match(/youtu\.be/)){
            parts = url.split("/");
            ID = parts[3].substr(0,11);
        }
        
        if(ID){
            data.embed = "&lt;iframe id=\"ytplayer\" allowfullscreen=\"allowfullscreen\" type=\"text/html\" frameborder=\"0\" src=\"https://www.youtube.com/embed/"+ID+"?enablejsapi=1&amp;autoplay=1\" fs=\"1\" width=\"600\" height=\"338\"&gt;&lt;/iframe&gt;";
            data.thumbnail = "//i2.ytimg.com/vi/"+ID+"/hqdefault.jpg";
	    //XXX: note that the URLS above are protocol-relative and do not include http/https
	    //if the page is loaded is http and the iframe in https or vice-versa, the youtube plugin does not work properly
	    //one caveat with relative urls is that the page will no longer work when using file:// to view the html file locally.
	    //if this is deemed to the problem, we can revert to http:// for now and simply assume that no one will visit this site via https://
            return data;
        }else{
            return false;
        }
    },

    // prepares embed code for js api access
    prepEmbed: function(embed) {
        return embed;
    }
};
