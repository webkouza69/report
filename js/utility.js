
/**
 * スムーズスクロール
 *
 * ページ内リンク（スムーズスクロール）
 * ページトップ（「pagetop」クラスを付与することでスムーズスクロール）
 * ページトップ（「pagetop-h」クラスを付与することでスムーズスクロール、ページが30pxスクロールすることでボタンをフェードイン）
 -----------------------------------------------------------------------------*/
$(function() {
    'use strict';
    var smoothScroll = function(pos) {
        $('html, body').animate({scrollTop: pos}, 'fast');
    };

    // 一旦フェードイン、フェードアウトするボタンの非表示
    $('.pagetop-h').hide();

    // ページトップへ戻るボタンをスクロールが発生した時点で表示する
    // $(window).on('scroll', function(){
    //     if ($(this).scrollTop() > 30) {
    //         $('.pagetop-h').stop().fadeIn();
    //     } else {
    //         $('.pagetop-h').stop().fadeOut();
    //     }
    // });

    // ページトップへ戻るボタンのスクロール
    $('.pagetop, .pagetop-h').on('click', function() {
        // スクロールの実施
        smoothScroll(0);
    });

    // ページ内（hrefに設定されたページ内リンクまで）のスクロール
    $(document).on('click', 'a[href^="#"]', function() {
        var href = $(this).attr('href');
        if ($('[id="' + href.substr(1) + '"]').length > 0) {
            var offsetTop = $('[id="' + href.substr(1) + '"]').first().offset().top;
            if ($(this).parents('ul').first().has('[id="inpage-links"]')) {
                offsetTop -= 0;
            }
            smoothScroll(offsetTop);
            return false;
        }
    });
});
