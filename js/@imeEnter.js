
/*!
 * jQuery.imeEnter v0.2.0 (http://hrdaya.github.io/jQuery.imeEnter/)
 *
 * Copyright 2015 yu-ki higa (https://github.com/hrdaya)
 * Licensed under MIT (https://github.com/hrdaya/jQuery.imeEnter/blob/master/LICENSE)
 */

(function ($) {
    'use strict';
    // プラグイン名
    var pluginName = 'imeEnter';

    var ua = window.navigator.userAgent.toLowerCase();
    var ver = window.navigator.appVersion.toLowerCase();
    var ie9 = ua.indexOf('msie') > -1 && ver.indexOf('msie 9.') > -1;

    // プラグイン本体
    var Plugin = function ($elm) {
        this.$elm = $elm;
        this.inComposition = false;
        this.oldVal = '';
        this.ie9 = ie9;
        this.on();
    };

    // プラグインのプロトタイプ
    Plugin.prototype = {
        // プラグインのイベント捕捉有効化
        on: function () {
            var self = this;

            // イベントの重複登録を避けるため一旦off
            self.off();

            // 捕捉するキーイベント
            var keyEvents = [
                'focus.' + pluginName,
                'blur.' + pluginName,
                'input.' + pluginName,
                'compositionstart.' + pluginName,
                'compositionend.' + pluginName
            ];

            // イベントの登録
            self.$elm.on(keyEvents.join(' '), function (e) {
                // イベントのタイプごとに処理
                switch (e.type) {
                    case 'focus':
                        // IE9の時のみselectionchangeの有効化
                        // IE9のonInputイベントに対するバグ対策
                        if (this.ie9) {
                            $(document).on('selectionchange.' + pluginName, function () {
                                // 値が変わった場合には確認用の値を更新してイベントを発火させる
                                if (self.isDifferent() && !self.inComposition) {
                                    self.setOldVal();
                                    self.fireEvent();
                                }
                            });
                        }
                        break;
                    case 'blur':
                        // フォーカスを外れたときは無効にする
                        // 余計なイベントを発行しないようにする為の処置
                        $(document).off('selectionchange.' + pluginName);
                        break;
                    case 'input':
                        // IME入力中でない時にイベントを発火させる
                        if (!self.inComposition) {
                            self.fireEvent();
                        }
                        break;
                    case 'compositionstart':
                        // IME入力中フラグのセット
                        self.inComposition = true;
                        break;
                    case 'compositionend':
                        // IME入力中フラグのリセット
                        self.inComposition = false;
                        // IMEでの入力が終わった時にcompositionendイベントが発火するが
                        // onInputイベントは発火しないのでその対策
                        self.fireEvent();
                        break;
                }
            });
        },
        // プラグインのイベント捕捉無効化
        off: function () {
            this.$elm.off('.' + pluginName);
        },
        // プラグインの破棄
        destroy: function () {
            this.off();
            this.$elm.removeData(pluginName);
        },
        // 古い値と今の値が違うかどうかの判定
        isDifferent: function() {
            return self.oldVal !== self.$elm.val();
        },
        // 値をセット
        setOldVal: function() {
            self.oldVal = self.$elm.val();
        },
        // イベントを発火させる
        fireEvent: function () {
            this.$elm.trigger($.Event('enter.' + pluginName));
        }
    };

    // プラグインの実行
    $.fn[pluginName] = function (method) {
        this.each(function () {
            // 文字列入力エリア以外には適用しない
            switch ($(this).prop('tagName').toLowerCase()) {
                case 'input':
                    switch ($(this).prop('type').toLowerCase()) {
                        case 'password':
                        case 'radio':
                        case 'checkbox':
                        case 'file':
                        case 'hidden':
                        case 'submit':
                        case 'image':
                        case 'reset':
                        case 'button':
                        case 'range':
                            return true;
                    }
                case 'textarea':
                    break;
                default:
                    return true;
            }
            // 登録されたデータ属性の取得
            var data = $.data(this, pluginName) ||
                       $.data(this, pluginName, new Plugin($(this)));
            // プロトタイプの関数に引数が存在する場合は関数の実行
            switch (method) {
                case 'on':
                case 'off':
                case 'destroy':
                    data[method]();
                    break;
            }
        });
    };
}(jQuery));
