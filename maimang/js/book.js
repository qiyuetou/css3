// 2015.4.30
var pageWidth = window.innerWidth,
    pageHeight = window.innerHeight,
    $container = $(".mod_container"),
    $wrap = $("#wrap"),
    $scene = $(".scene"),
    $bookblock = $('#bookblock'),
    $scenelast=$("#scenelast"),
    $sceneselect=$("#sceneselect"),
    $window = $(window),
    $scenebook=$("#scenebook"),
    $scenebookMain = $("#scenebook_main"),
    $words = $(".words"),
    $scenebookBg=$("#scenebook_bg"),
    currentScene = 0,
    sceneClass=['polinance','literature','lifeshow','professional']
    panelBackground = [
        ['images/11.png', 'images/12.png', 'images/13.png', 'images/14.png']
    ];
$scenelast.attr("class","scene scenelast"+(currentScene+1));
$scenebook.attr('class','scene '+sceneClass[0]);
$scenebookBg.css({
    "height":pageHeight*4+'px'
});
$scene.css({
    width: '100%',
    height: pageHeight + 'px'
}).show();
var transEndEventName = function() {
    var el = document.createElement('div')
    var transEndEventNames = {
        'transition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd otransitionend'
    }

    for (var name in transEndEventNames) {
        if (el.style[name] !== undefined) {
            return transEndEventNames[name]
        }
    }
    el = null;
    return false
};
//bookblock
(function($, window, undefined) {
    var defaults = {
        orientation: 'vertical',
        direction: 'ltr',
        speed: 400,
        easing: 'ease-in-out',
        shadows: true,
        shadowSides: 0.8,
        shadowFlip: 0.1,
        circular: false,
        nextEl: '',
        prevEl: '',
        autoplay: false,
        interval: 3000,
        onEndFlip: function(old, page, isLimit) {
            return false;
        },
        onBeforeFlip: function(page) {
            return false;
        },
        onFirst: function() {
            return false;
        },
        onLast: function() {
            return false;
        }
    };
    $.BookBlock = function(options, element) {
        this.$el = $(element);
        this.elWidth = this.$el[0].getBoundingClientRect().width || this.$el[0].offsetWidth;
        this.options = $.extend(defaults, options);
        //this.$el.addClass('bb-' + this.options.orientation);
        this.$items = this.$el.children();
        this.itemsCount = this.$items.length;
        this.current = 0;
        this.previous = -1;
        this.$current = this.$items.eq(this.current).show();
        this.elWidth = this.$el.width();
        this.transEndEventName = transEndEventName() + '.bookblock';
        this.end = false;
        this._init(this.options);
    };
    $.BookBlock.prototype = {
        _init: function(options) {
            this._initEvents();
            //this._action('next');
        },
        _initEvents: function() {
            var self = this,
                start, delta, ishorizontal;
            var events = {
                handleEvent: function(event) {
                    switch (event.type) {
                        case 'touchstart':
                            this.start(event);
                            break;
                        case 'touchmove':
                            this.move(event);
                            break;
                        case 'touchend':
                            this.end(event);
                            break;
                    }
                },
                start: function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var touches = event.touches[0];
                    start = {
                        x: touches.pageX,
                        y: touches.pageY,
                        time: +new Date
                    };
                    $scenebookBg.removeClass("isanimation");
                    ishorizontal = undefined;
                    if (self.current===1 || self.current===self.itemsCount-1) {
                        $wrap.removeClass("isanimation");
                    }
                },
                move: function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    if (event.touches.length > 1 || event.scale && event.scale !== 1) return
                    var touches = event.touches[0];
                    // measure change in x and y
                    delta = {
                        x: touches.pageX - start.x,
                        y: touches.pageY - start.y
                    }
                    if (typeof ishorizontal == 'undefined') {
                        ishorizontal = !!(ishorizontal || Math.abs(delta.y) < Math.abs(delta.x));
                    }
                    if (!ishorizontal) {}
                    if (self.current===1 && delta.y>0 || self.current===self.itemsCount-1&&delta.y<0) {
                        $wrap.css({"-webkit-transform":'translate3d(0px, '+ (-pageHeight*2+delta.y) +'px, 0px)'})
                        return;
                    }
                    $scenebookBg.css({"-webkit-transform":'translate3d(0px, '+ (-(self.current-1)*pageHeight+delta.y) +'px, 0px)'})
                },
                end: function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var duration = +new Date - start.time;
                    var isValidSlide = Number(duration) < 250 && Math.abs(delta.y) > 20 || Math.abs(delta.y) > self.elWidth / 6;
                    if (self.current===1 || self.current===self.itemsCount-1) {
                        $wrap.addClass("isanimation");
                    }
                    if (!ishorizontal && self.current===1 && delta.y>0) {
                        if (Number(duration) < 250 && delta.y > 20 || delta.y > self.elWidth / 6) {
                            $wrap.css({"-webkit-transform":'translate3d(0px, '+ (-pageHeight) +'px, 0px)'});
                            self.options.onFirst();
                            return;
                        } else if (delta.y < self.elWidth / 6) {
                            $wrap.css({"-webkit-transform":'translate3d(0px, '+ (-pageHeight*2) +'px, 0px)'});
                        }
                    }
                    if (!ishorizontal && self.current===self.itemsCount-1&&delta.y<0) {
                        if (Number(duration) < 250 && delta.y < -20 || delta.y < -(self.elWidth / 6)) {
                            $wrap.css({"-webkit-transform":'translate3d(0px, '+ (-pageHeight*3) +'px, 0px)'});
                            self.options.onLast();
                            return;
                        } else if (delta.y > -(self.elWidth / 6)) {
                            $wrap.css({"-webkit-transform":'translate3d(0px, '+ (-pageHeight*2) +'px, 0px)'});
                        }
                    }

                    if (!ishorizontal && isValidSlide ){
                        $scenebookBg.addClass("isanimation");
                        self._action(delta.y < 0 ? 'next' : 'prev')
                    }


                }
            }
            $scenebook[0].addEventListener("touchstart", events);
            $scenebook[0].addEventListener("touchmove", events);
            $scenebook[0].addEventListener("touchend", events);
        },
        _action: function(dir, idx) {
            //this._stopSlideshow();
            this._navigate(dir, idx);
        },
        _navigate: function(dir, idx) {
            var self = this,isPosition=false;
            this.current = idx ? idx : this.current;
            if (dir === "next") {
                // if (this.current > this.itemsCount - 2) {
                //     this.options.onLast();
                //     return;
                // };
                isPosition = this.current>0 ? true:false;
                this.current +=1;
                for(var i=1; i<=4; i++){
                    var indexClass;
                    if(i<this.current){
                        indexClass =' foldleft';
                    }else if(i===this.current){
                        indexClass =' unfold';
                    }else if(i>this.current){
                        indexClass =' foldright';
                    }
                    $('.words').eq(currentScene).find(".line").eq(i-1).attr('class', 'line line'+i+indexClass);
                    $('#bg'+i).attr('class', indexClass);
                }
                for(var i=0; i<=4; i++){
                    if(i<this.current){
                         this.$items.eq(i).attr('class', 'page foldleft');
                    }else if(i===this.current){
                        this.$items.eq(i).attr('class', 'page unfold');
                    }else if(i>this.current){
                        this.$items.eq(i).attr('class', 'page foldright');
                    }
                }
                this.$items.eq(this.current-1).attr('class', 'page pre');
                $scenebookMain.attr('class','p_turnleft page'+this.current);

            } else if (dir === "prev") {
                // if (this.current < 2) {
                //     this.current = 0;
                //     this.options.onFirst();
                //     this.$items.eq(this.current).attr('class', 'page ini');
                //     this.$items.eq(this.current+1).attr('class', 'page foldright');
                //     this.$items.eq(this.current+2).attr('class', 'page foldright');
                //     return;
                // };
                isPosition=true;
                this.current -=1;
                for(var i=1; i<=4; i++){
                    var indexClass;
                    if(i<this.current){
                        indexClass =' foldleft';
                    }else if(i===this.current){
                        indexClass =' unfold';
                    }else if(i>this.current){
                        indexClass =' foldright';
                    }
                    $('.words').eq(currentScene).find(".line").eq(i-1).attr('class', 'line line'+i+indexClass);
                    $('#bg'+i).attr('class', indexClass);
                }
                for(var i=0; i<=4; i++){
                    if(i<this.current){
                         this.$items.eq(i).attr('class', 'page foldleft');
                    }else if(i===this.current){
                        this.$items.eq(i).attr('class', 'page unfold');
                    }else if(i>this.current){
                        this.$items.eq(i).attr('class', 'page foldright');
                    }
                }
                this.$items.eq(this.current+1).attr('class', 'page pre');
                $scenebookMain.attr('class','p_turnright page'+this.current);
                
            }
            $scenebookBg.css({"-webkit-transform":'translate3d(0px, '+ (-(this.current-1)*pageHeight) +'px, 0px)'})
            //$scenebook
            return;

        },
        _startSlideshow: function() {},
        _stopSlideshow: function() {},
        next: function() {
            this._action('next');
        },
        prev: function() {
            this._action('prev');
        },
        jump: function(page) {
            this.current = page-1;
            this._action('next');
        },
        last: function() {
            this.jump(this.itemsCount);
        },
        first: function() {
            this.jump(1);
        },
        isActive: function() {},
        update: function() {},
        destroy: function() {}
    }

    $.fn.bookblock = function(options) {
        if (typeof options === 'string') {
            var args = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                var $this = $(this);
                var instance = $this.data('bookblock');
                if (!instance) {
                    return;
                }
                var instance = $.fn.bookblock.lookup[$this.data('bookblock')];
                instance[options].apply(instance, args);
            });
        } else {
            this.each(function() {
                var $this = $(this);
                var instance = $this.data('bookblock');
                if (instance) {
                    // var args = Array.prototype.slice.call(arguments, 1);
                    // var instance = $.fn.bookblock.lookup[$this.data('bookblock')];
                    // instance[options].apply(instance, args);

                    instance._init();
                } else {

                    $.fn.bookblock.lookup[++$.fn.bookblock.lookup.i] = new $.BookBlock(options, this);
                    instance = $this.data('bookblock', $.fn.bookblock.lookup.i);
                }
            });
        }
        return this;
    };
    $.fn.bookblock.lookup = {
        i: 0
    };    

})($, window);
//iPage
(function($,window,undefined){
    var defaults = {
        current:1,
        onFirst: function() {
            //return false;
        },
        onLast: function() {
            //return false;
        },
        onChange:function(current){
        }
    };
    $.iPage = function(options,element){
        this.$el = $(element);
        this.options = $.extend(defaults, options);
        this.current = this.options.current,
        this.$items = this.$el.children();
        this.itemsCount = this.$items.length;
        this._init(this.options);
    };
    $.iPage.prototype = {
        _init: function(options) {
            this._initEvents();
            this.$items.removeClass("current").eq(0).addClass("current");
        },
        _initEvents: function() {
            var self = this,
                start, delta, ishorizontal;
            var events = {
                handleEvent: function(event) {
                    switch (event.type) {
                        case 'touchstart':
                            this.start(event);
                            break;
                        case 'touchmove':
                            this.move(event);
                            break;
                        case 'touchend':
                            this.end(event);
                            break;
                    }
                },
                start: function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var touches = event.touches[0];
                    start = {
                        x: touches.pageX,
                        y: touches.pageY,
                        time: +new Date
                    };
                    delta={x:0,y:0};
                    self.$el.removeClass("isanimation");
                    ishorizontal = undefined;
                },
                move: function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    if (event.touches.length > 1 || event.scale && event.scale !== 1) return
                    var touches = event.touches[0];
                    delta = {
                        x: touches.pageX - start.x,
                        y: touches.pageY - start.y
                    }
                    if (typeof ishorizontal == 'undefined') {
                        ishorizontal = !!(ishorizontal || Math.abs(delta.y) < Math.abs(delta.x));
                    }
                    if (!ishorizontal) {
                        self.$el.css({"-webkit-transform":'translate3d(0px, '+ (-(self.current-1)*pageHeight+delta.y) +'px, 0px)'})
                    }
                    
                },
                end: function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var duration = +new Date - start.time;
                    self.$el.addClass("isanimation");
                    var isValid = Number(duration) < 250 && Math.abs(delta.y) > 20 || Math.abs(delta.y) > pageHeight / 12;
                    if (!ishorizontal && isValid ){
                        self._action(delta.y < 0 ? 'next' : 'prev')
                    } else {
                        self.$el.css({"-webkit-transform":'translate3d(0px, '+ (-(self.current-1)*pageHeight) +'px, 0px)'})
                    }
                    
                }
            }
            this.$el[0].addEventListener("touchstart", events);
            this.$el[0].addEventListener("touchmove", events);
            this.$el[0].addEventListener("touchend", events);
        },
        _action: function(dir, idx) {
            this._navigate(dir, idx);
        },
        _navigate: function(dir, idx) {

            var self = this;
            this.current = idx ? idx : this.current;
            if (dir === "next") {
                if (this.current > this.itemsCount - 1) {
                    this.current = this.itemsCount;
                    this.options.onLast();
                } else {
                    this.current +=1;
                }
            } else if (dir === "prev") {
                if (this.current < 2) {
                    this.current = 1;
                    this.options.onFirst();
                } else {
                    this.current -=1;
                }
            }
            self.$el.css({"-webkit-transform":'translate3d(0px, '+ (-(self.current-1)*pageHeight) +'px, 0px)'})
            this.$items.removeClass("current").eq(this.current-1).addClass("current");
            console.log(this.options);
            this.options.onChange(this.current);
        },
        jump: function(page) {
            this.current = page-1;
            this._action('next')
        }
    }
    $.fn.iPage = function(options) {
        if (typeof options === 'string') {
            var args = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                var $this = $(this);
                var instance = $this.data('iPage');
                if (!instance) {
                    return;
                }
                var instance = $.fn.iPage.lookup[$this.data('iPage')];
                instance[options].apply(instance, args);
            });
        } else {
            this.each(function() {
                var $this = $(this);
                var instance = $this.data('iPage');
                if (instance) {
                    instance._init();
                } else {

                    $.fn.iPage.lookup[++$.fn.iPage.lookup.i] = new $.iPage(options, this);
                    instance = $this.data('iPage', $.fn.iPage.lookup.i);
                }
            });
        }
        return this;
    };
    $.fn.iPage.lookup = {
        i: 0
    };
})($,window);
//loadImg
(function($,window,undefined){
    var defaults = {
        src:[],
        onload:function(){},
        oncomplete:function(){}
    };
    $.loadImg=function(options,element){
        this.$el = $(element);
        this.options = $.extend(defaults,options);
        this._init(this.options);
    }
    $.loadImg.prototype = {
        _init: function(options) {
            if (!$.isArray(this.options.src)) {
                return;
            };
            var self = this,len=this.options.src.length, count=0;
            $.each(this.options.src,function(i,element){
                var img = new Image();
                img.src=element;
                if (img.complete){
                    console.log("complete")
                    ++count;
                    self.options.onload((count/len*100).toFixed(0));
                    count==len && self.options.oncomplete();
                } else {
                    img.onload=function(e){
                        ++count;
                        self.options.onload((count/len*100).toFixed(0));
                        count==len && self.options.oncomplete();
                    }
                }
            })
        }
    }
    $.fn.loadImg = function(options) {
        if (typeof options === 'string') {
            var args = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                var $this = $(this);
                var instance = $this.data('loadImg');
                if (!instance) {
                    return;
                }
                var instance = $.fn.loadImg.lookup[$this.data('loadImg')];
                instance[options].apply(instance, args);
            });
        } else {
            this.each(function() {
                var $this = $(this);
                var instance = $this.data('loadImg');
                if (instance) {
                    instance._init();
                } else {
                    $.fn.loadImg.lookup[++$.fn.loadImg.lookup.i] = new $.loadImg(options, this);
                    instance = $this.data('loadImg', $.fn.loadImg.lookup.i);
                }
            });
        }
        return this;
    };
    $.fn.loadImg.lookup = {
        i: 0
    };
})($,window); 
// loading
$("body").append('<div class="loading_container"><div class="loading"></div><div id="loading_text">loading</div></div>');
$("body").loadImg({
    src:[
        //index
        'img/music.png',
        'img/index.jpg',
        'img/home_star.png',
        //select
        'img/select_book.png',
        'img/select_shelf.jpg',
        'img/select_window.jpg',
        //book
        'img/book_shadow.png',
        //scene1
        'img/pn/bg_1n.png',
        'img/pn/bg_2n.png',
        'img/pn/bg_4.png',
        'img/pn/building1.png',
        'img/pn/launchingtower.png',
        'img/pn/bg_elem_3.jpg',
        'img/pn/moat.png',
        //scene2
        'img/lr/bg_1.jpg',
        'img/lr/bg_2.jpg',
        'img/lr/bg_3.jpg',
        'img/lr/bg_4.jpg',
        'img/lr/sakura_white.png',
        'img/lr/halfnote.png',
        'img/lr/leaf.png',
        'img/lr/leaf2.png',
        'img/lr/note_blue.png',
        'img/lr/note_white.png',
        'img/lr/lotus_leaf.png',
        'img/lr/raindrops.png',
        'img/lr/girl.png',
        'img/lr/boywithboat.png',
        'img/lr/girl2.png',
        'img/lr/girlwithbike.png',
        //scene3
        'img/ls/flowers.png',
        'img/ls/flowers2.png',
        'img/ls/bg_1.png',
        'img/ls/bg_2n.png',
        'img/ls/bg_3.png',
        //scene4
        'img/pf/window_out.png',
        'img/pf/bg_2.jpg',
        'img/pf/bg_3.jpg',
        'img/pf/bg_4.jpg',
        'img/pf/seagull.png',
        'img/pf/parents.png',
        'img/pf/balloon.png',
        //last
        'img/logo.png',
        'img/bookshelf.png'
    ],
    onload:function(percent){
        $("#loading_text").html(percent+'%')
    },
    oncomplete:function(){
        halo.config({combo:false,wait:true}).use('uievent', 'warn', 'weixinshare', function(m) {
            var shareConfig=m.weixinshare(
                window.location.href,
                'img/share.jpg',
                '测试地址',
                '不做无益之事，何以遣有涯之生'
            );
            // shareConfig.cb=function(ret){
            //     alert(ret);
            // };
            // shareConfig.desc='描述变了哦';
            // shareConfig.useTitle=true;

            //music
            var music=document.getElementById('music')
            var audio=new Audio(),audioState='';
            audio.src="img/music.mp3";
            audio.autoplay=false;
            m.on(audio,'play',function(){
                m.addClass(music,'play');
                audioState='playing'
            });
            m.on(audio,'pause',function(){
                m.addClass(music,'pause');
                audioState='pause';
            });
            m.on(audio,'ended',function(){
                audio.play();
                audioState='ended';
            });
            m.on(music,'flick',function(){
                if('playing'==audioState){
                    m.removeClass(music,'play');
                    audio.pause();
                }else{
                    m.addClass(music,'play');
                    audio.play();
                }
            });
            //TODO
            $container.show();
            audio.play();

            (function(){
                var self = this,
                    start, delta, ishorizontal;
                var events = {
                    handleEvent: function(event) {
                        switch (event.type) {
                            case 'touchstart':
                                this.start(event);
                                break;
                            case 'touchmove':
                                this.move(event);
                                break;
                            case 'touchend':
                                this.end(event);
                                break;
                        }
                    },
                    start: function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        var touches = event.touches[0];
                        start = {
                            x: touches.pageX,
                            y: touches.pageY,
                            time: +new Date
                        };
                        delta={x:0,y:0};
                        ishorizontal = undefined;
                    },
                    move: function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        if (event.touches.length > 1 || event.scale && event.scale !== 1) return
                        var touches = event.touches[0];
                        delta = {
                            x: touches.pageX - start.x,
                            y: touches.pageY - start.y
                        }
                        if (typeof ishorizontal == 'undefined') {
                            ishorizontal = !!(ishorizontal || Math.abs(delta.y) < Math.abs(delta.x));
                        }
                        
                    },
                    end: function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        var duration = +new Date - start.time;
                        if (Number(duration) < 250 && delta.y < -20 || delta.y < -pageHeight / 6) {
                            $(".sceneselect_shelf_text").addClass("flash");
                            setTimeout(function(){
                                $(".sceneselect_shelf_text").removeClass("flash")
                            },1000)
                        }
                        if (Number(duration) < 250 && delta.y > 20 || delta.y > pageHeight / 6) {
                            $wrap.iPage("jump",1);
                        }
                    }
                }
                $sceneselect[0].addEventListener("touchstart", events);
                $sceneselect[0].addEventListener("touchmove", events);
                $sceneselect[0].addEventListener("touchend", events);
            })();
            //跳转场景
            (function(){
                $(".sceneselect_shelf_list li").each(function(i,el){
                    var self = this,
                        start, delta, ishorizontal;
                    var events = {
                        handleEvent: function(event) {
                            switch (event.type) {
                                case 'touchstart':
                                    this.start(event);
                                    break;
                                case 'touchmove':
                                    this.move(event);
                                    break;
                                case 'touchend':
                                    this.end(event);
                                    break;
                            }
                        },
                        start: function(event) {
                            event.preventDefault();
                            event.stopPropagation();
                            var touches = event.touches[0];
                            start = {
                                x: touches.pageX,
                                y: touches.pageY,
                                time: +new Date
                            };
                            delta={x:0,y:0};
                            $wrap.removeClass("isanimation");
                            ishorizontal = undefined;
                        },
                        move: function(event) {
                            event.preventDefault();
                            event.stopPropagation();
                            if (event.touches.length > 1 || event.scale && event.scale !== 1) return
                            var touches = event.touches[0];
                            delta = {
                                x: touches.pageX - start.x,
                                y: touches.pageY - start.y
                            }
                            if (typeof ishorizontal == 'undefined') {
                                ishorizontal = !!(ishorizontal || Math.abs(delta.y) < Math.abs(delta.x));
                            }
                            if (!ishorizontal&&delta.y>0) {
                                $wrap.css({"-webkit-transform":'translate3d(0px, '+ (-pageHeight+delta.y) +'px, 0px)'})
                            }
                            
                        },
                        end: function(event) {
                            event.preventDefault();
                            event.stopPropagation();
                            var duration = +new Date - start.time;
                            $wrap.addClass("isanimation");
                            //此时为点击
                            if (!ishorizontal && Number(duration) < 250 && Math.abs(delta.y) < 20) {
                                currentScene = i;
                                $scenebook.attr('class','scene '+sceneClass[currentScene]);
                                $scenelast.attr('class', 'scene scenelast_'+sceneClass[currentScene]);
                                $wrap.iPage("jump",3);
                            }
                            if (delta.y>0&&delta.y<pageHeight / 6||delta.y&&delta.y==pageHeight / 6) {
                                $wrap.css({"-webkit-transform":'translate3d(0px, '+ (-pageHeight) +'px, 0px)'})
                            }
                            //向上翻转
                            if (Number(duration) < 250 && delta.y > 20 || delta.y > pageHeight / 6) {
                                currentScene = 1;
                                $wrap.iPage("jump",1);
                            }
                            //提示选择
                            if (Number(duration) < 250 && delta.y < -20 || delta.y < -pageHeight / 6) {
                                $(".sceneselect_shelf_text").addClass("flash");
                                setTimeout(function(){
                                    $(".sceneselect_shelf_text").removeClass("flash")
                                },1000)
                            }

                            
                        }
                    }
                    el.addEventListener("touchstart", events);
                    el.addEventListener("touchmove", events);
                    el.addEventListener("touchend", events);
                })
                // $(".sceneselect_shelf_list").delegate("li","touchstart",function(event){
                //     currentScene = $(this).index();
                //     $scenebook.attr('class','scene '+sceneClass[currentScene]);
                //     $wrap.iPage("jump",3);
                // });
            })();
            //再看一次
            $(".scenelast_command_btn2").on("touchend",function(event){
                event.preventDefault();
                event.stopPropagation();
                $wrap.iPage("jump",1);
            });
            //drag
            $wrap.iPage({
                onChange:function(i){
                    if (i==3) {
                        //$scenebookBg.css({"-webkit-transform":'translate3d(0px, 0px, 0px)'})
                        $('.bg_elem div').attr('class','foldright');
                        $bookblock.bookblock('jump',1);
                    }
                }
            });
            $bookblock.bookblock({
                onFirst: function(){
                    $wrap.iPage("jump",2);
                },
                onLast: function(){
                    $wrap.iPage("jump",4);
                }
            });
        });
    }
});
//loader

