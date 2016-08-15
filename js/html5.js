/**
 * html5のタグをIE8以下に認識させるJS
 */
(function() {
    var i, len;
    var e = [
        'article', 'aside', 'details', 'figcaption', 'figure',
        'footer', 'header', 'hgroup', 'menu', 'nav', 'section'
    ];
    for (i = 0, len = e.length; i < len; i++) {
        document.createElement(e[i]);
    }
}());
