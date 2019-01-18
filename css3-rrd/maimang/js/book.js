


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

    }
});