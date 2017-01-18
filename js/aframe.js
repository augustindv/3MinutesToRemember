/* global AFRAME */

var actualscene = "porte-present";
var actualsceneselector = "#porte-present";
var timeoutfade = -1;
var timeoutimage = -1;
var timeoutvisible = -1;
var timeoutoutfront = -1;
/**
 * Component that listens to an event, fades out an entity, swaps the texture, and fades it
 * back in.
 */
AFRAME.registerComponent('set-image', {
  schema: {
    on: {type: 'string'},
    target1: {type: 'selector'},
    target2: {type: 'selector'},
    target3: {type: 'selector'},
    target4: {type: 'selector'},
    target5: {type: 'selector'},
    src: {type: 'string'},
    src2: {type: 'string'},
    unlock: {type: 'selector'},
    front: {type: 'selector'}
  },

  init: function () {
    var data = this.data;
    var el = this.el;

    //this.setupFadeAnimation();

    el.addEventListener('click', function () {
      if (data.src.includes("passe") && !el.parentElement.id.includes("Z")) {
        setTimeout(function() {
          $("#leave").css("display", "block")
        }, 2000);
      } else {
        setTimeout(function() {
          $("#leave").css("display", "none")
        }, 2000);
      }
      $("#leave").click(function() {
      var els = document.getElementsByClassName("out");
        for (var i = 0; i < els.length; i++) {
          var element = els[i].childNodes[0];
          if (element.getAttribute('visible')) {
            element.click();
          }
        };
      });

      if (data.front != null) {
        var front = document.createElement("img");
        front.setAttribute('id', 'front');
        front.setAttribute('src', data.front.getAttribute('src'));
        if (!front.className.includes('frontforw')) front.className += 'frontforw';
        document.body.appendChild(front);

        var outfront = document.createElement("img");
        outfront.setAttribute('id', 'outfront');
        outfront.setAttribute('src', 'img/front/Graph-Close.png');
        if (!outfront.className.includes('outfrontforw')) outfront.className += 'outfrontforw';
        outfront.onclick = function() {
          front.className = '';
          outfront.className = '';
          if (!front.className.includes('frontback')) front.className += 'frontback';
          if (!outfront.className.includes('outfrontback')) outfront.className += 'outfrontback';
          $(front).css('animation-play-state', 'running');
          $(outfront).css('animation-play-state', 'running');
          var els = document.getElementsByClassName("out");
          for (var i = 0; i < els.length; i++) {
            var element = els[i].childNodes[0];
            if (element.getAttribute('visible')) {
              element.click();
              fade_out_audio(global_present, 0);
              fade_out_audio(global_passe, 1);
            }
          };
          globalpapier(0); 
          timeoutoutfront = setTimeout(function () {
            document.body.removeChild(front);
            document.body.removeChild(outfront);
          }, 1000)
        }
        document.body.appendChild(outfront);
      }

      var fade;
      var fadeOeilDescend;
      var fadeOeilMonte;
      if (el.parentElement.id.includes("P")) {
        fade = document.createElement("img");
        fade.setAttribute('id', 'fade');
        fade.setAttribute('src', 'img/fade.png');
        document.body.appendChild(fade);
      } else {
        fadeOeilDescend = document.createElement("div");
        fadeOeilDescend.className += "OeilDescend";
        var tmp = document.createElement("img");
        tmp.setAttribute('src', 'transition/Oeil_TransitionTop.png');
        tmp.style += "z-index:500;";
        tmp.className += "oeilTop";
        fadeOeilDescend.appendChild(tmp);
        fadeOeilMonte = document.createElement("div");
        fadeOeilMonte.className += "OeilMonte";
        tmp = document.createElement("img");
        tmp.setAttribute('src', 'transition/Oeil_TransitionBottom.png');
        tmp.style += "z-index:600;";
        tmp.className += "oeilBottom";
        fadeOeilMonte.appendChild(tmp);
        document.body.appendChild(fadeOeilDescend);
        document.body.appendChild(fadeOeilMonte);
      }


      if (data.unlock != null)
        data.unlock.setAttribute('data-unlocked', true);

      if (data.src.includes('passe')) {
        fade_out_audio(global_present, 0);
        fade_out_audio(global_passe, 1);
        if (data.src.includes('cuisine')) {
          fade_out_audio(cuisine_petitdejeuner, 1);
        }
        if (data.src.includes('veranda')) {
          fade_out_audio(veranda_passe, 1);
        }
        if (data.src.includes('chambre')) {
          fade_out_audio(chambre_passe, 1);
        }
      } else {
        fade_out_audio(global_present, 1);
        fade_out_audio(global_passe, 0);
        if (data.src.includes('cuisine')) {
          fade_out_audio(cuisine_petitdejeuner, 0);
        }
        if (data.src.includes('veranda')) {
          fade_out_audio(veranda_passe, 0);
        }
        if (data.src.includes('chambre')) {
          fade_out_audio(chambre_passe, 0);
        }
      }

      var imagetarget = getTarget(data, 1).getAttribute('src');
      if (!imagetarget.includes(data.src)) {
      setTimeout(function () {
        // Set image.
        for (var i = 1; i <= 5; i++) {
          var target = getTarget(data, i);
          target.setAttribute('src', data.src+"-"+i);
        }
      }, 1400),
      timeoutfade = setTimeout(function () {
        if (fade != null) {
          document.body.removeChild(fade);
        } else if (fadeOeilDescend != null && fadeOeilMonte != null) {
          document.body.removeChild(fadeOeilDescend);
          document.body.removeChild(fadeOeilMonte);
        }
      }, 2700);
    }});
  },
}),

AFRAME.registerComponent('volume-in', {
  schema: {
    on: {type: 'string'},
    target: {type: 'selector'},
    voltarget: {type: 'number'}
  },

  init: function () {
    var data = this.data;
    var el = this.el;
    var audio = data.target;
    if (audio != null) {
      audio.muted = false; 
      audio.volume = 0;

      el.addEventListener(data.on, function () {
        //clearAllIntervals();

        var fadeAudio = setInterval(function () {

          // Only fade if past the fade out point or not at zero already
          if (audio.volume < data.voltarget) {
              audio.volume += 0.01;
              audio.volume = Math.round(audio.volume * 100) / 100;
          }
          if (audio.volume > data.voltarget) {
              audio.volume -= 0.01;
              audio.volume = Math.round(audio.volume * 100) / 100;
          }
          // When volume at zero stop all the intervalling
          if (audio.volume == data.voltarget) {
              clearInterval(fadeAudio);
          }
        }, 10);
      });
    }
  } 
}),

AFRAME.registerComponent('volume-out', {
  schema: {
    on: {type: 'string'},
    target: {type: 'selector'},
    voltarget: {type: 'number'}
  },

  init: function () {
    var data = this.data;
    var el = this.el;
    var audio = data.target;

    el.addEventListener(data.on, function () {
      //clearAllIntervals();

      // Fade out image.
      audio.muted = false; 
      var fadeAudio = setInterval(function () {

        // Only fade if past the fade out point or not at zero already
        if (audio.volume > data.voltarget) {
            audio.volume -= 0.01;
            audio.volume = Math.round(audio.volume * 100) / 100;
        }
        // When volume at zero stop all the intervalling
        if (audio.volume <= data.voltarget) {
            clearInterval(fadeAudio);
        }
      }, 10);
    });
  }
}),

AFRAME.registerComponent('change-scene', {
  schema: {
    on: {type: 'string'},
    target: {type: 'selector'},
    initial: {type: 'selector'},
    unlocked: {type: 'boolean'}
  },

  init: function () {
    var data = this.data;
    var el = this.el;
    var target = data.target;
    var initial = data.initial;

    for (var i = 0; i < $(initial).children().length; i++) {
      var child = $(initial).children()[i];
      child.setAttribute('visible', false);
      for (var j = 0; j < child.childNodes.length; j++) {
        var child2 = child.childNodes[j];
        if (child2.nodeName.includes("ENTITY")) {
          child2.setAttribute('visible', false);
        }
      }
    }
    for (var i = 0; i < $(actualsceneselector).children().length; i++) {
      var child = $(actualsceneselector).children()[i];
      child.setAttribute('visible', true);
      for (var j = 0; j < child.childNodes.length; j++) {
        var child2 = child.childNodes[j];
        if (child2.nodeName.includes("ENTITY"))
          child2.setAttribute('visible', true);
      }
    }

    el.addEventListener(data.on, function () {
      timeoutvisible = setTimeout(function () {
        actualsceneselector = target;
        target.setAttribute('visible', true);
        initial.setAttribute('visible', false);   
        for (var i = 0; i < $(target).children().length; i++) {
          var child = $(target).children()[i];
          child.setAttribute('visible', true);
          for (var j = 0; j < child.childNodes.length; j++) {
            var child2 = child.childNodes[j];            
            if (child2.nodeName.includes("ENTITY")) {
              child2.setAttribute('visible', true);
            }
          }
        }
        for (var i = 0; i < $(initial).children().length; i++) {
          var child = $(initial).children()[i];
          child.setAttribute('visible', false);
          for (var j = 0; j < child.childNodes.length; j++) {
            var child2 = child.childNodes[j];
            if (child2.nodeName.includes("ENTITY"))
              child2.setAttribute('visible', false);
          }
        }
      }, 1400);
    });
  }
});