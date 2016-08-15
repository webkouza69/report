/**
 * ページ別JavaScript
 */

// Stringオブジェクトの拡張
(function () {
    'use strict';
    // ID用に「#」を付与して返す
    String.prototype.addHash = function() {
        return '#' + this;
    };
    // Class用に「.」を付与して返す
    String.prototype.addDot = function() {
        return '.' + this;
    };
    // 整数に変換して返す
    String.prototype.toInt = function() {
        return parseInt(this, 10);
    };
    // 拡張トリム
    String.prototype.trimEx = function() {
        return this.replace(/^[\s【】\(\)]+|[\s【】\(\)]+$/g, '');
    };
    // 改行変換
    String.prototype.nl2br = function() {
        return this.replace(/(\r\n|\r|\n)/g, '<br>');
    };
    // BR変換
    String.prototype.br2nl = function() {
        return this.replace(/(<br>|<br \/>)/g, "\r\n");
    };
    // 隅付き括弧をつけて返す
    String.prototype.addSumi = function() {
        return '【' + this + '】';
    };
    // 2桁に0埋めして返す
    String.prototype.padZero = function() {
        return ('00' + this).slice(-2);
    };
}());

// テーブル操作用ｊQueryプラグイン
(function ($) {
    'use strict';
    // th,tdから「rowspan」を取得
    $.fn.getRowspan = function () {
        return parseInt(this.first().attr('rowspan'), 10) || 1;
    };
    // th,tdから「colspan」を取得
    $.fn.getColspan = function () {
        return parseInt(this.first().attr('colspan'), 10) || 1;
    };
    // trに表示されているth,tdがあるかどうかの判定
    $.fn.isEmptyRow = function () {
        return this.first().children('th:not(:hidden),td:not(:hidden)').length === 0;
    };
    // 指定したエレメントが表示された状態で1つ以上存在するかどうかの判定
    $.fn.isShown = function () {
        var i = 0;
        this.each(function () {
            i = $(this).is(':not(:hidden)') ? ++i : i;
        });
        return i > 0;
    };
    // 指定のエレメントの所属するテーブルのカラムクラスの取得
    $.fn.getColClass = function () {
        var $table = this.first().parents('table').first();
        var $ths = $table.children('thead').first().find('th');
        var colClass = [];
        var colspan = 1;
        $ths.each(function (i) {
            if (i === 0) {
                colspan = parseInt($(this).attr('colspan'), 10) || 1;
                colClass.push('col1_1');
                if (colspan !== 1) {
                    colClass.push('col1_2');
                }
            } else {
                colClass.push('col' + (i + 1));
            }
        });
        return colClass;
    };
}(jQuery));


$(function() {
    'use strict';

    // 編集したかどうかの判定
    var isEdit = false;

    // ソート中かどうかの判定
    var isSorting = false;

    // IDやクラス名一覧
    var Names = {
        hidden: 'hidden',
        disabled: 'disabled',
        selected: 'selected',
        fixed: 'fixed',
        hover: 'hover',
        drag: 'dragging',
        section: 'tn-section',                  // PHPのtidyでHTML5に対応していない為、divのクラスで対策する
        btnSave: 'btn-save',                    // 下書き保存ボタンのID
        btnPreview: 'btn-preview',              // プレビューボタンのID
        btnCancel: 'btn-cancel',                // プレビューのキャンセルボタンのID
        btnPublishing: 'btn-publishing',        // 本番に公開するボタンのID
        btnsPanelThead: 'btns-thead',           // テーブルのヘッダ項目のボタングループID
        btnEditThead: 'btn-edit-thead',         // テーブルのヘッダ項目の編集ボタンID
        btnAddBox: 'btn-add-box',               // セル内のコンテンツボックスの追加ボタンのID
        btnEditBox: 'btn-edit-box',             // セル内のコンテンツボックスの編集ボタンのID
        btnDelBox: 'btn-remove-box',            // セル内のコンテンツボックスの削除ボタンのID
        cntName: 'content-name',                // コンテンツのページ名
        cntHeadBtns: 'page-btns',               // ページ更新用等のボタン群
        cntBody : 'cnt-body',                   // コンテンツを表示しているBODY
        cntBodyEmptyImg: 'img-empty',           // 内容が無い時に表示する画像のID
        cntBodyPnlAlert: 'pnl-alert',           // 内容の注意等を表示するパネル
        cntBodyPnlSuccess: 'pnl-success',       // 内容の成功等を表示するパネル
        cntBodyDataWrap: 'data-wrap',           // データとタイトル等を分けるラッパー
        cntPreview: 'ctn-preview',              // プレビュー用コンテナ
        mdlCate: 'modal-cate',                  // カテゴリ編集用のモーダル
        mdlCateTable: 'modal-cate-sorttable',   // カテゴリ一覧テーブル
        mdlCateBtnAdd: 'cate-btn-add',          // カテゴリ追加ボタン
        mdlCateBtnRef: 'cate-btn-reflect',      // カテゴリ反映ボタン
        mdlCateName: 'cate-name',               // カテゴリ名入力クラス
        mdlCateId: 'cate-id',                   // カテゴリid入力クラス
        mdlCateIdPre: 'tn-',                    // カテゴリidのプレフィクス
        mdlCateClass: 'cate-class',             // カテゴリclass入力
        mdlCateEnable: 'cate-slc-enabled',      // カテゴリの表示・削除
        mdlCateDel: 'cate-del',                 // カテゴリ削除フラグ
        mdlCateSort: 'cate-sort',               // カテゴリ並べ替え用
        mdlCateNowId: 'data-nowval',            // 現在のカテゴリID(データ属性)
        mdlCateErrInput: 'input-err',           // inputに付けるエラークラス
        mdlCateErrPnl: 'pnl-err',               // エラー内容表示divに付けるクラス
        mdlCateErrOverlap: 'overlap-err',       // 重複エラーの場合に付けるエラークラス
        mdlMenu: 'modal-menu',                  // ページの一覧の編集・選択用のモーダル
        mdlMenuBtnShow: 'menu-btn-show',        // 選択したページを表示するためのボタン
        mdlLoading: 'modal-loading',            // ローディング用モーダル
        uiSelected: 'ui-selected',              // jQueryUIの選択済みクラス
        uiSelecting: 'ui-selecting',            // jQueryUIの選択中クラス
        uiSelectee: 'ui-selectee',              // jQueryUIの選択可能クラス
        uiSortable: 'ui-sortable',              // jQueryUIのソートクラス
        uiSortableDisabled: 'ui-sortable-disablede', // jQueryUIのソートクラス
        ctm: 'context-menu',                    // コンテキストメニュー
        ctmHover: 'context-hover',              // コンテキストメニュー表示時にhoverクラスが削除される為、代わりとなるクラス
        ctmSeparator: 'separator',              // コンテキストメニューのセパレータ用のクラス
        ctmMoveUp: 'move-up',                   // コンテキストメニューの上に移動ID
        ctmMoveDown: 'move-down',               // コンテキストメニューの下に移動ID
        ctmJoinCell: 'join-cell',               // コンテキストメニューのセルの結合ID
        ctmSplitCell: 'split-cell',             // コンテキストメニューのセルの分割ID
        ctmSplitCol: 'split-col',               // コンテキストメニューのセルの列分割ID
        ctmAddRow: 'add-row',                   // コンテキストメニューの行の追加ID
        ctmDelRow: 'del-row',                   // コンテキストメニューの行の削除ID
        ctmAddTfoot: 'add-tfoot',               // コンテキストメニューのフッター行の追加ID
        ctmDelTfoot: 'del-tfoot',               // コンテキストメニューのフッター行の削除ID
        ctmTitle: 'context-menu-title',         // 表の2列・3列切り替え用のコンテキストメニュー
        ctmTitle2Col: 'show-2col',              // 2列にするID
        ctmTitle3Col: 'show-3col',              // 3列にするID
        tblWrap: 'table-wrapper',               // 表のラッパークラス
        rowSeparator: 'row-separator',          // 行の追加や移動先を分かりやすくするためのセパレータID
        hoverRowTop: 'hover-row-top',           // ホバー行の上のライン用のID
        hoverRowBottom: 'hover-row-bottom',     // ホバー行の下のライン用のID
        showDelRow: 'show-del-row',             // 削除予定セルの色を変える為のクラス
        showMoveRow: 'show-move-row',           // 移動する行のまとまりの背景色を変える為のクラス
        // 表のセルに付与されているクラス群
        colClasses: [
            'col1_1',
            'col1_2',
            'col2',
            'col3'
        ],
        headEdit: 'head-edit',                  // テーブルヘッダセル編集用パネル
        dataUpdate: 'updated',                  // 表示しているコンテンツの更新日を保存するためのdata属性
        dataMenuName: 'data-menu-name',         // メニューのページ名を保存しているdata属性
        dataTargetElm: 'targetElm'              // モーダル等で使用するターゲットとなるエレメントを保存しておくdata属性
    };

    // セル内のボックスのIDやクラス名
    var BoxNames = {
        wrap: 'box-wrap',                                   // セル内コンテンツのラップクラス
        moveHandle: 'box-move',                             // ドラッグ用ハンドルID
        wrapPhone: 'box-phone',                             // 電話ブロックのラッピングクラス
        wrapMail: 'box-mail',                               // メールブロックのラッピングクラス
        wrapHp: 'box-hp',                                   // ホームページのラッピングクラス
        wrapReception: 'box-reception',                     // 受付日時のラッピングクラス
        center: 'box-center-name',                          // センタ名クラス
        address: 'box-address',                             // 住所クラス
        free: 'box-free',                                   // フリー項目クラス
        phoneGroup: 'box-phone-group',                      // 電話番号のグループクラス
        phonePrefix: 'box-phone-prefix',                    // 電話番号見出しクラス
        phoneNumber: 'box-phone-number',                    // 電話番号クラス
        phoneSuffix: 'box-phone-suffix',                    // 電話番号見出しクラス
        phoneOtherStateClass: 'box-phone-other-state',      // 電話番号期限クラス
        phoneOtherDateClass: 'box-phone-other-date',        // 電話番号期限クラス
        phoneOtherNumberClass: 'box-phone-other-number',    // 電話番号期限クラス
        phoneOtherState: 'data-other-state',                // 電話番号期限の種類data属性
        phoneOtherDate: 'data-other-date',                  // 電話番号期限data属性
        phoneOtherNumber: 'data-other-number',              // 電話番号期限data属性
        phoneDefaultNumber: 'data-default-number',          // 電話番号期限data属性
        hpPrefix: 'box-hp-prefix',                          // ホームページの見出しクラス
        hpAddress: 'box-hp-address',                        // ホームページのアドレスクラス
        mailGroup: 'box-mail-group',                        // メールのグループクラス
        mailPrefix: 'box-mail-prefix',                      // メールの見出しクラス
        mailAdress: 'box-mail-address',                     // メールアドレスクラス
        receptionDate: 'box-reception-date',                // 受付日クラス
        receptionWeekday: 'data-weekday',                   // 受付日の平日data属性
        receptionSaturday: 'data-saturday',                 // 受付日の土曜日data属性
        receptionSunday: 'data-sunday',                     // 受付日の日曜日data属性
        receptionHoliday: 'data-holiday',                   // 受付日の祝日data属性
        reception365days: 'data-365days',                   // 受付日の年中無休data属性
        receptionTime: 'box-reception-time',                // 受付時間クラス
        receptionAllowed: 'data-allowed',                   // 受付日の指定時間受付data属性
        receptionHourFrom: 'data-fromhour',                 // 受付時間の始まり時間data属性
        receptionTimeFrom: 'data-fromtime',                 // 受付時間の始まり分data属性
        receptionHourTo: 'data-tohour',                     // 受付時間の終わり時間data属性
        receptionTimeTo: 'data-totime',                     // 受付時間の終わり分data属性
        receptionLunch: 'data-lunch',                       // 受付時間の昼休憩時間data属性
        blackOut: 'box-reception-blackout',                 // 除外日クラス
        blackOutMay: 'data-may',                            // 除外日の5月data属性
        blackOutEndYear: 'data-endyear',                    // 除外日の年末年始data属性
        blackOutOther: 'data-other',                        // 除外日のその他data属性
        other: 'box-other'                                  // その他項目クラス
    };

    // セル編集画面のIDやクラス名
    var EditNames = {
        panel: 'edit-box',                          // セル内コンテンツの編集用パネル
        btnUpdate: 'btn-update-box',                // 更新ボタンID
        btnCancel: 'btn-cancel-box',                // キャンセルボタンID
        btnPhoneAdd: 'btn-add-phone',               // 電話番号の追加クラス
        btnPhoneDel: 'btn-del-phone',               // 電話番号の削除クラス
        btnMailAdd: 'btn-add-mail',                 // メールの追加クラス
        btnMailDel: 'btn-del-mail',                 // メールの削除クラス
        btnMailDelWrap: 'btn-del-mail-wrap',        // メールの削除ボタンのラップクラス
        center: 'edit-center',                      // センタ名ID
        address: 'edit-address',                    // 住所ID
        free: 'edit-free',                          // フリー項目ID
        phoneGroupWrap: 'phone-group-wrap',         // 電話番号のグループラップID
        phoneGroup: 'phone-group',                  // 電話番号のグループクラス
        phonePrefix: 'edit-phone-prefix',           // 電話番号見出しクラス
        phoneNumber: 'edit-phone-number',           // 電話番号クラス
        phoneSuffix: 'edit-phone-suffix',           // 電話番号見出しクラス
        phoneOtherState: 'edit-phone-other-state',  // 「からの」は1、「までの」は2
        phoneOtherDate: 'edit-phone-other-date',    // 電話番号期限クラス
        phoneOtherNumber: 'edit-phone-other-number',// 期限までの電話番号クラス
        hpPrefix: 'edit-hp-prefix',                 // ホームページの見出しID
        hpAddress: 'edit-hp-address',               // ホームページのアドレスID
        mailGroupWrap: 'mail-group-wrap',           // メールのグループのラップID
        mailGroup: 'mail-group',                    // メールのグループクラス
        mailPrefix: 'edit-mail-prefix',             // メールの見出しクラス
        mailAdress: 'edit-mail-address',            // メールアドレスクラス
        receptionWeekday: 'rcpd-weekday',           // 受付日の平日ID
        receptionSaturday: 'rcpd-saturday',         // 受付日の土曜日ID
        receptionSunday: 'rcpd-sunday',             // 受付日の日曜日ID
        receptionHoliday: 'rcpd-holiday',           // 受付日の祝日ID
        reception365days: 'rcpd-365days',           // 受付日の年中無休ID
        receptionTimeName: 'rcpt-time',             // 受付日のラジオボタンンの名前
        receptionNothing: 'rcpt-nothing',           // 受付日の表示しないID
        receptionAllowed: 'rcpt-allowed',           // 受付日の指定時間受付ID
        reception24hour: 'rcpt-24hour',             // 受付日の24時間受付ID
        receptionHourFrom: 'rcpt-fromhour',         // 受付時間の始まり時間ID
        receptionTimeFrom: 'rcpt-fromtime',         // 受付時間の始まり分ID
        receptionHourTo: 'rcpt-tohour',             // 受付時間の終わり時間ID
        receptionTimeTo: 'rcpt-totime',             // 受付時間の終わり分ID
        receptionLunch: 'rcpt-lunchbreak',          // 受付時間の昼休憩時間ID
        blackOutMay: 'bko-may',                     // 除外日の5月ID
        blackOutEndYear: 'bko-end-year',            // 除外日の年末年始ID
        blackOutOther: 'bko-other',                 // 除外日のその他ID
        other: 'edit-other',                        // その他項目ID
        fieldAddress: 'field-address',
        fieldFree: 'field-free',
        fieldPhone: 'field-phone',
        fieldHp: 'field-hp',
        fieldMail: 'field-mail',
        fieldRcpd: 'reception-date',
        fieldRcpt: 'reception-time',
        fieldBko: 'reception-blackout',
        fieldOther: 'field-other',
        editBox: 'text-edit'
    };

    // 初期化処理
    var Init = function() {
        // イベントの割り当て
        Events.add();
        // ボタンの有効・無効化
        TopButtons.hide();
        // 誘導用画像をテンプレート用にコピー
        ImgInduction.copy();
        // プレビュー画面の初期設定
        Preview.load();
        // カテゴリ編集のドラッグアンドドロップの有効化
        $(Names.mdlCateTable.addHash()).sortable({
            handle: Names.mdlCateSort.addDot()
        });

        // ページ選択用のメニューを選択した時の処理
        $('.cnt h3').on('mouseenter', function() {
            $(this).next('ul').removeClass(Names.hidden).slideDown('fast');
        }).on('mouseleave', function() {
            $(this).next('ul').slideUp('fast');
        });

        // 初期表示で社内用　受付全般を表示するようにする
        Ajaxs.get('html/get/index');
    };


    // イベント
    var Events = {
        // 初期化時に登録するイベント
        add: function() {
            /* 上部のボタンの固定 ----------------------------------------------- */
            var $head = $('.cnt-head').first();
            $(window).on('scroll', function() {
                if ($(window).scrollTop() > $('.site-header').first().outerHeight(true)) {
                    $head.addClass(Names.fixed);
                } else {
                    $head.removeClass(Names.fixed);
                }
            });


            /* 表のイベント ----------------------------------------------------- */
            // ホバー
            var hovers =[
                Names.tblWrap.addDot() + ' tbody tr',
                Names.tblWrap.addDot() + ' tbody th',
                Names.tblWrap.addDot() + ' tbody td'
            ];
            // 行・セルのホバー時にホバークラスの付与
            $(document).on('mouseenter', hovers.join(','), function (e) {
                $(this).addClass(Names.hover);
            }).on('mouseleave', hovers.join(','), function () {
                $(this).removeClass(Names.hover);
            });
            // 行のホバー時に枠線を表示
            // $(document).on('mouseenter', Names.tblWrap.addDot() + ' tbody tr', function () {
            //     DataTable.hoverRow(this);
            // });
            // セルのホバー時に追加ボタンを表示
            hovers.shift();
            $(document).on('mouseenter.hover', hovers.join(','), function () {
                Cells.addAddBoxBtn(this);
            }).on('mouseleave.hover', hovers.join(','), function () {
                Cells.removeAddBoxBtn();
            });
            // セル内コンテンツの追加ボタンを押した時の処理
            $(document).on('click', Names.btnAddBox.addHash(), function() {
                Cells.addBox(this);
            });


            /* セル内コンテンツでの処理 ---------------------------------------------*/
            // セル内コンテンツのドラッグアンドドロップ処理
            Events.addCellHovers();
            // セル内のコンテンツブロック用のイベント
            Events.addContentsBlock();


            /* theadでの処理 ---------------------------------------------------*/
            $(document).on('mouseenter', Names.tblWrap.addDot() + 'thead th', function() {
                $(this).append($(Names.btnsPanelThead.addHash()).removeClass(Names.hidden));
            }).on('mouseleave', 'thead th', function() {
                $('body').append($(Names.btnsPanelThead.addHash()).addClass(Names.hidden));
            });
            // 編集ボタンを押した時の処理
            $(Names.btnEditThead.addHash()).on('click', function() {
                Cells.editThead($(this).parents('th').first());
                $('body').append($(Names.btnsPanelThead.addHash()).addClass(Names.hidden));
            });
            // theadのthをダブルクリックした時の処理
            $(document).on('dblclick', 'thead th', function() {
                Cells.editThead(this);
            });
            // theadのthの編集パネルで反映するボタンを押した時の処理
            $(Names.headEdit.addHash() + '-reflection').on('click', function() {
                Cells.updateThead(this);
            });
            // theadのthの編集パネルでキャンセルボタンを押した時の処理
            $(Names.headEdit.addHash() + '-cancel').on('click', function() {
                Cells.cancelThead(this);
            });
            // 編集パネル上のクリックの時は何もしない
            $(Names.headEdit.addHash()).on('click', function() {
                return false;
            });
            // thead編集パネルのラップをクリックした時に閉じる
            $(Names.headEdit.addHash() + '-wrap').on('click', function() {
                Cells.cancelThead(this);
            });


            /* tfootでの処理 ---------------------------------------------------*/
            // tfootのセルをダブルクリックした時の処理
            Events.addTfoot();
            // tfootからフォーカスが外れたときの処理
            $(document).on('blur', 'tfoot textarea', function() {
                Cells.updateTfoot(this);
            });


            /* セル内コンテンツの編集パネル -------------------------------------------------- */
            // セル内コンテンツ編集パネルを閉じる時の処理
            $(EditNames.panel.addHash()).on('hidden.bs.modal', function(e) {
                EditPanel.hide(e);
            });
            // セル内コンテンツの編集パネル内のテキストエリアをWYSIWYGエディタに変換
            EditPanel.setWyswyg();
            // セル内コンテンツの編集パネル内のイベント
            Events.addModalEdit();


            /* コンテキストメニュー ------------------------------------------------- */
            // 表示
            $(document).on('contextmenu', Names.tblWrap.addDot() + ' tbody', function (e) {
                Context.show(this, e);
                // 標準のコンテキストメニューのキャンセル
                return false;
            });
            // 非表示
            $(document).on('click', Names.ctm.addHash(), function () {
                $('tbody').find(Names.hover.addDot()).removeClass(Names.hover);
                $('tbody').find(Names.ctmHover.addDot()).removeClass(Names.ctmHover);
                $('tbody').find(Names.uiSelected.addDot() + Names.hidden.addDot()).removeClass(Names.uiSelected);
                Context.hide(this);
            }).on('contextmenu', Names.ctm.addHash(), function() {
                $(this).trigger('click');
                return false;
            });
            // コンテキストメニュー内のイベントを登録
            Events.addContext();


            /* カテゴリの編集関係イベント ------------------------------------------- */
            // カテゴリ編集用モーダル表示時の処理
            $(Names.mdlCate.addHash()).on('show.bs.modal', function(e) {
                ModalCate.show(this);
            });
            // カテゴリ編集用モーダル内のイベント
            Events.addModalCategory();


            /* 問合せ先一覧関係イベント ------------------------------------------- */
            // 問合せ先一覧用モーダル表示時の処理
            // $(Names.mdlMenu.addHash()).on('show.bs.modal', function(e) {
            //     ModalMenu.show($(this).find('table').first());
            // });
            // 問合せ一覧選択用モーダル画面内のイベント
            Events.addModalMenu();

            $('.title').on('mouseenter', function() {
                $(this).children('ul').stop().slideDown();
            }).on('mouseleave', function() {
                $(this).children('ul').stop().slideUp();
            });


            /* プレビュー画面でのイベント  ------------------------------------------- */
            // 閉じるボタンを押した時の処理
            $(Names.btnCancel.addHash()).on('click', function() {
                Preview.hide();
            });
            // 本番環境に公開するボタンを押した時の処理
            $(Names.btnPublishing.addHash()).on('click', function() {
                Contents.publishing();
            });


            /* 「下書き保存する」ボタンイベント ---------------------------------------------- */
            $(Names.btnSave.addHash()).on('click', function() {
                Contents.save();
            });

            /* 「プレビュー」ボタンイベント --- ------------------------------------------- */
            $(Names.btnPreview.addHash()).on('click', function() {
                Preview.show();
            });
        },
        // tfootエリアのイベント
        addTfoot: function() {
            $(document).on('dblclick', 'tfoot td', function() {
                Cells.editTfoot(this);
            });
        },
        removeTfoot: function() {
            $(document).off('dblclick', 'tfoot td');
        },
        // コンテキストメニュー内のイベント
        addContext: function() {
            // コンテキストの行の上へ移動
            $(Names.ctmMoveUp.addHash()).on('click', function () {
                if ($(this).hasClass(Names.disabled)) {
                    return false;
                }
                DataTable.moveUpRow();
            }).on('mouseenter', function () {
                if (!$(this).hasClass(Names.disabled)) {
                    DataTable.hoverUpRow();
                }
            }).on('mouseleave', function () {
                // セパレータと背景を非表示
                $(Names.showMoveRow.addDot()).removeClass(Names.showMoveRow);
                $(Names.rowSeparator.addHash()).hide();
            });
            // コンテキストの行の下へ移動
            $(Names.ctmMoveDown.addHash()).on('click', function () {
                if ($(this).hasClass(Names.disabled)) {
                    return false;
                }
                DataTable.moveDownRow();
            }).on('mouseenter', function () {
                if (!$(this).hasClass(Names.disabled)) {
                    DataTable.hoverDownRow();
                }
            }).on('mouseleave', function () {
                // セパレータと背景を非表示
                $(Names.showMoveRow.addDot()).removeClass(Names.showMoveRow);
                $(Names.rowSeparator.addHash()).hide();
            });
            // コンテキストのセルの結合イベント
            $(Names.ctmJoinCell.addHash()).on('click', function () {
                if ($(this).hasClass(Names.disabled)) {
                    return false;
                }
                DataTable.joinCell();
            });
            // コンテキストのセルの分割イベント
            $(Names.ctmSplitCell.addHash()).on('click', function () {
                if ($(this).hasClass(Names.disabled)) {
                    return false;
                }
                DataTable.splitCell();
            });
            // コンテキストのセルの列分割イベント
            $(Names.ctmSplitCol.addHash()).on('click', function () {
                if ($(this).hasClass(Names.disabled)) {
                    return false;
                }
                DataTable.splitCol();
            });
            // コンテキストの行の追加イベント
            $(Names.ctmAddRow.addHash()).on('click', function () {
                if ($(this).hasClass(Names.disabled)) {
                    return false;
                }
                DataTable.addRow(this);
            }).on('mouseenter', function () {
                if (!$(this).hasClass(Names.disabled)) {
                    DataTable.hoverAddRow();
                }
            }).on('mouseleave', function () {
                $(Names.rowSeparator.addHash()).hide();
            });
            // コンテキストの行の削除イベント
            $(Names.ctmDelRow.addHash()).on('click', function () {
                if ($(this).hasClass(Names.disabled)) {
                    return false;
                }
                DataTable.delRow(this);
            }).on('mouseenter', function () {
                DataTable.hoverDelRow();
            }).on('mouseleave', function () {
                $(Names.showDelRow.addDot()).removeClass(Names.showDelRow);
            });
            // 2列表示
            $(Names.ctmTitle2Col.addHash()).on('click', function () {
                if ($(this).hasClass(Names.disabled)) {
                    return false;
                }
                DataTable.show2Col();
            });
            // 3列表示
            $(Names.ctmTitle3Col.addHash()).on('click', function () {
                if ($(this).hasClass(Names.disabled)) {
                    return false;
                }
                DataTable.show3Col();
            });
            // フッター行の追加
            $(Names.ctmAddTfoot.addHash()).on('click', function () {
                if ($(this).hasClass(Names.disabled)) {
                    return false;
                }
                DataTable.addTfoot();
            });
            // フッター行の削除
            $(Names.ctmDelTfoot.addHash()).on('click', function () {
                if ($(this).hasClass(Names.disabled)) {
                    return false;
                }
                DataTable.removeTfoot();
            });
        },
        // セル内のコンテンツブロック用のイベント
        addContentsBlock: function() {
            // セル内コンテンツの削除ボタンを押した時の処理
            $(document).on('click', Names.btnDelBox.addHash(), function() {
                var $parentBox = $(this).parents(BoxNames.wrap.addDot()).first();
                if (confirm("削除すると元に戻せません。\n削除しますか？")) {
                    Cells.removeBox($parentBox);
                }
            });
            // セル内コンテンツの編集画面表示の際の処理
            $(document).on('click', Names.btnEditBox.addHash(), function() {
                EditPanel.show(this);
            }).on('dblclick', BoxNames.wrap.addDot(), function() {
            // セル内コンテンツをダブルクリックした時の処理
                EditPanel.show($(this).children().first());
            });
        },
        // セルのブロック編集用モーダル画面内のイベント
        addModalEdit: function() {
            // セル内コンテンツの内容を更新した時の処理
            $(document).on('click', EditNames.btnUpdate.addHash(), function() {
                EditPanel.update();
            });
            $(document).on('click', EditNames.btnCancel.addHash(), function() {
                var $editBox = $(EditNames.panel.addHash()).data(Names.dataTargetElm);
                if ($(EditNames.panel.addHash()).data('addState')) {
                    $editBox.remove();
                }
            });
            // 編集パネルの値が変わった時の処理
            var changes =[
                EditNames.panel.addHash() + ' input',
                EditNames.panel.addHash() + ' textarea',
                EditNames.panel.addHash() + ' select',
            ];
            $(document).on('change enter.imeEnter', changes.join(','), function() {
                EditPanel.setVal(this);
            });
            // 電話番号の追加
            $(document).on('click', EditNames.btnPhoneAdd.addHash(), function () {
                EditPanel.addPhone(this);
            });
            // 電話番号の削除
            $(document).on('click', EditNames.btnPhoneDel.addDot(), function () {
                EditPanel.delPhone(this);
            });
            // メールアドレスの追加
            $(document).on('click', EditNames.btnMailAdd.addHash(), function () {
                EditPanel.addMail(this);
            });
            // メールアドレスの削除
            $(document).on('click', EditNames.btnMailDel.addDot(), function () {
                EditPanel.delMail(this);
            });
            // テキストエリアの説明文の開閉
            $(document).on('click', '.edit-note-title', function() {
                $(this).next('.edit-note-wrap').slideToggle('fast');
            });
            // fieldsetの開閉
            $(document).on('click', '.edit-section-title', function() {
                if ($(this).hasClass('close')) {
                    $(this).removeClass('close');
                } else {
                    $(this).addClass('close');
                }
                $(this).next('fieldset').slideToggle('fast');
            });

            //文字が選択されているか判断
            var checkSelectionText = function () {
                return getSelection().toString().length > 0;
            };
            var getSelection = function () {
                if (window.getSelection) {
                    return window.getSelection();
                } else if (document.getSelection) {
                    return document.getSelection();
                } else if (document.selection) {
                    return document.selection;
                }
            };
            // 小文字ボタン
            $(document).on('click', '.small', function () {
                if (checkSelectionText()) {
                    var $inputArea = $(this).parents(EditNames.editBox.addDot() + '-wrap').first()
                                        .find(EditNames.editBox.addDot() + '-editbox').first();
                    var $textArea = $(this).parents(EditNames.editBox.addDot() + '-wrap').first()
                                        .find(EditNames.editBox.addDot()).first();
                    $inputArea.focus();

                    var selection = getSelection();
                    var range = selection.getRangeAt(0);
                    var font = document.createElement('font');
                    font.style.fontSize = 'smaller';
                    range.surroundContents(font);

                    $textArea.val($inputArea.html()).trigger('input');
                }
            });
            // 赤字ボタン
            $(document).on('click', '.red', function () {
                if (checkSelectionText()) {
                    var $inputArea = $(this).parents(EditNames.editBox.addDot() + '-wrap').first()
                                        .find(EditNames.editBox.addDot() + '-editbox').first();
                    var $textArea = $(this).parents(EditNames.editBox.addDot() + '-wrap').first()
                                        .find(EditNames.editBox.addDot()).first();
                    $inputArea.focus();

                    var selection = getSelection();
                    var range = selection.getRangeAt(0);
                    var font = document.createElement('font');
                    font.style.color = 'rgb(204,0,0)';
                    range.surroundContents(font);

                    $textArea.val($inputArea.html()).trigger('input');
                }
            });
            // 太字ボタン
            $(document).on('click', '.bold', function () {
                if (checkSelectionText()) {
                    var $inputArea = $(this).parents(EditNames.editBox.addDot() + '-wrap').first()
                                        .find(EditNames.editBox.addDot() + '-editbox').first();
                    var $textArea = $(this).parents(EditNames.editBox.addDot() + '-wrap').first()
                                        .find(EditNames.editBox.addDot()).first();
                    $inputArea.focus();

                    var selection = getSelection();
                    var range = selection.getRangeAt(0);
                    var font = document.createElement('font');
                    font.style.fontWeight = 'bold';
                    range.surroundContents(font);

                    $textArea.val($inputArea.html()).trigger('input');
                }
            });
            var rng;
            // リンクボタン
            $(document).on('click', '.link', function () {
                // if (checkSelectionText()) {
                    var $inputArea = $(this).parents(EditNames.editBox.addDot() + '-wrap').first()
                                        .find(EditNames.editBox.addDot() + '-editbox').first();
                    var $textArea = $(this).parents(EditNames.editBox.addDot() + '-wrap').first()
                                        .find(EditNames.editBox.addDot()).first();
                    $inputArea.focus();

                    var selection = getSelection();
                    rng = selection.getRangeAt(0);

                    var $inputPanel = $(this).parents(EditNames.editBox.addDot() + '-wrap').first().find('.edit-link').first();
                    $inputPanel.data('state', 'link');
                    $inputPanel.find('.edit-link-blank-label').first().show();
                    $inputPanel.find('.edit-link-blank').first().prop('checked', false);
                    $(this).parent().append($('#modal-back'));
                    $('#modal-back').show();
                    $inputPanel.show();
                    $inputPanel.find('input').first().val('').focus();
                // }
            });
            // メール挿入ボタン
            $(document).on('click', '.mail', function () {
                var $inputArea = $(this).parents(EditNames.editBox.addDot() + '-wrap').first()
                                    .find(EditNames.editBox.addDot() + '-editbox').first();
                var $textArea = $(this).parents(EditNames.editBox.addDot() + '-wrap').first()
                                    .find(EditNames.editBox.addDot()).first();
                $inputArea.focus();

                var selection = getSelection();
                rng = selection.getRangeAt(0);

                var $inputPanel = $(this).parents(EditNames.editBox.addDot() + '-wrap').first().find('.edit-link').first();
                $inputPanel.data('state', 'mail');
                $inputPanel.find('.edit-link-blank-label').first().hide();
                $(this).parent().append($('#modal-back'));
                $('#modal-back').show();
                $inputPanel.show();
                $inputPanel.find('input').first().val('').focus();
            });
            // リンク挿入パネル更新
            $(document).on('click', '.edit-link-submit', function() {
                var $inputArea = $(this).parents(EditNames.editBox.addDot() + '-wrap').first()
                                    .find(EditNames.editBox.addDot() + '-editbox').first();
                var $textArea = $(this).parents(EditNames.editBox.addDot() + '-wrap').first()
                                    .find(EditNames.editBox.addDot()).first();
                var $inputPanel = $(this).parents('.edit-link').first();
                var val = $(this).parents('div').first().find('input').first().val();

                if (val !== '') {
                    var a = document.createElement('a');
                    var hrefVal = $inputPanel.data('state') === 'link' ? val : 'mailto:' + val;
                    a.setAttribute('href', hrefVal);
                    if ($inputPanel.find('.edit-link-blank').first().prop('checked')) {
                        a.setAttribute('target', '_blank');
                    }
                    $inputArea.focus();
                    if (rng.collapsed) {
                        a.innerHTML = val;
                        rng.insertNode(a);
                    } else {
                        try {
                            rng.surroundContents(a);
                        } catch(e) {
                            alert('同じ範囲にすでにリンクが挿入されています');
                        }
                    }

                    $textArea.val($inputArea.html()).trigger('input');
                }

                $('body').append($('#modal-back'));
                $('#modal-back').hide();
                $(this).parents('.edit-link').first().hide();
            });
            // リンク挿入パネルキャンセル
            $(document).on('click', '.edit-link-cancel', function() {
                var $inputArea = $(this).parents(EditNames.editBox.addDot() + '-wrap').first()
                                    .find(EditNames.editBox.addDot() + '-editbox').first();

                $('body').append($('#modal-back'));
                $('#modal-back').hide();
                $(this).parents('.edit-link').first().hide();
            });
            // 背景をクリックした時にリンク挿入パネルを閉じる
            $('#modal-back').on('click', function() {
                $('body').append($('#modal-back'));
                $('#modal-back').hide();
                $('.edit-link').hide();
            });
            // アンセットボタン
            $(document).on('click', '.reset', function () {
                if (checkSelectionText()) {
                    var $inputArea = $(this).parents(EditNames.editBox.addDot() + '-wrap').first()
                                        .find(EditNames.editBox.addDot() + '-editbox').first();
                    var $textArea = $(this).parents(EditNames.editBox.addDot() + '-wrap').first()
                                        .find(EditNames.editBox.addDot()).first();
                    $inputArea.focus();
                    document.execCommand('removeformat');
                    document.execCommand('unlink');

                    $textArea.val($inputArea.html()).trigger('input');
                }
            });
            // ソースの表示ボタン
            $(document).on('click', '.source', function () {
                var $inputArea = $(this).parents(EditNames.editBox.addDot() + '-wrap').first()
                                    .find(EditNames.editBox.addDot() + '-editbox').first();
                var $textArea = $(this).parents(EditNames.editBox.addDot() + '-wrap').first()
                                    .find(EditNames.editBox.addDot()).first();
                if ($inputArea.is(':visible')) {
                    $(this).parent().children('button').each(function() {
                        if (!$(this).hasClass('source')) {
                            $(this).addClass('hidden');
                        }
                    });
                    $inputArea.hide();
                    $textArea.show().focus();
                    $(this).text('編集エリアの表示');
                } else {
                    $(this).parent().children('button').each(function() {
                        if (!$(this).hasClass('source')) {
                            $(this).removeClass('hidden');
                        }
                    });
                    var val = $textArea.val();
                    // scriptという文字を削除
                    val = val.replace(/(<\/?)script/gi, "$1span");
                    $textArea.val(val);
                    $inputArea.html(val);
                    $textArea.hide();
                    $inputArea.show().focus();
                    $(this).text('ソースの表示');
                }
            });
        },
        // カテゴリ編集モーダル内のイベント
        addModalCategory: function() {
            // カテゴリー編集モーダルの行の「表示」「削除」の値が変わった時の処理
            $(document).on('change', Names.mdlCateEnable.addDot(), function() {
                ModalCate.changeCateEnable(this);
            });

            // カテゴリの追加ボタンを押した時の処理
            $(Names.mdlCateBtnAdd.addHash()).on('click', function() {
                ModalCate.addRow();
            });

            // カテゴリの反映するボタンを押した時の処理
            $(Names.mdlCateBtnRef.addHash()).on('click', function() {
                ModalCate.reflect();
            });

            // カテゴリの名前のバリデーション処理
            $(document).on('change', Names.mdlCateName.addDot(), function() {
                ModalCate.validateName(this);
            });

            // カテゴリのidのバリデーション処理
            $(document).on('change', Names.mdlCateId.addDot(), function() {
                ModalCate.validateId(this);
            });

            // カテゴリのclassのバリデーション処理
            $(document).on('change', Names.mdlCateClass.addDot(), function() {
                ModalCate.validateClass(this);
            });

            // 編集パネルのドラッグ処理
            var $modal = $(EditNames.panel.addHash());
            var $dragElm = $modal.find(".modal-header").first();
            var $moveElm = $modal.find(".modal-content").first();
            var moveFlag;
            var offsetTop;
            var offsetLeft;
            // ドラッグクラスの付与
            $dragElm.addClass(Names.drag);
            // マウスダウンした時に座標を取得
            $dragElm.on("mousedown", function (event) {
                moveFlag = true;
                event = (event) || window.event;
                offsetTop = event.clientY - $moveElm.offset().top;
                offsetLeft = event.clientX - $moveElm.offset().left;
            });
            // マウスアップした時に移動フラグを無効にする
            $(document).on("mouseup", function () {
                moveFlag = false;
            });
            // マウスが動いた時に移動する
            $(document).on("mousemove", function (event) {
                event = (event) || window.event;
                if (moveFlag) {
                    $moveElm.offset({
                        top: event.clientY - offsetTop,
                        left: event.clientX - offsetLeft
                    });
                }
            });
        },
        // 問合せ一覧ページの選択用モーダル内のイベント
        addModalMenu: function() {
            // 問合せ一覧のリストを選択した時の処理
            // $(document).on('click', Names.mdlMenu.addHash() + ' li', function() {
            //     ModalMenu.liSelect(this);
            // });
            $(document).on('click', Names.mdlMenu.addHash() + ' .title li', function() {
                ModalMenu.liSelect(this);
                ModalMenu.getPage(this);
            });

            // 選択したページを表示するボタンを押した時の処理
            // $(Names.mdlMenuBtnShow.addHash()).on('click', function() {
            //     ModalMenu.getPage();
            // });
        },
        /* セル内コンテンツのドラッグアンドドロップ時のイベント -------------------------------- */
        // イベントの追加
        addCellHovers: function() {
            // 編集用ページが表示されているときはselectableを有効にする
            if ($(Names.cntBody.addDot()).first().find('table').length > 0) {
                $('tbody').selectable('enable');
            }
            // セル内コンテンツにホバーした際に移動バーを挿入
            $(document).on('mouseenter', BoxNames.wrap.addDot(), function () {
                $('tbody').selectable('disable');
                if (!isSorting) {
                    // 移動バーの挿入
                    Cells.addMoveBox(this);
                    // ホバークラスの付与
                    $(this).parents('tbody').first().find(Names.ctmHover.addDot()).removeClass(Names.ctmHover);
                    $(this).addClass(Names.hover);
                    // ドラッグアンドドロップの有効化
                    Cells.enableSortableCol(this);
                }
            }).on('mouseleave', BoxNames.wrap.addDot(), function () {
                $('tbody').selectable('enable');
                if (!isSorting) {
                    // 移動バーの削除
                    Cells.removeMoveBox();
                    // ホバークラスの削除
                    $(this).removeClass(Names.hover);
                    // ドラッグアンドドロップの無効化
                    Cells.disableSortableCol(this);
                }
            });
        },
        // イベントの削除
        removeCellHovers: function(colClasses) {
            // テーブルセルの選択を無効化
            $('tbody').selectable('disable');
            // セル内のボックスがホバーされた時のイベントを無効化
            $(document).off('mouseenter.hover', BoxNames.wrap.addDot());
        }
    };


    // ajaxの初期値
    $.ajaxSetup({
        'type'    : 'GET',
        'dataType': 'json',
        'cache': false,
        'headers': {
            'Pragma': 'no-cache'
        }
    });
    // ajax処理
    var Ajaxs = {
        get: function(url) {
            Loading.show();
            $.ajax({
                url: url,
            }).done(function(res) {
                // コンテンツのクリア
                Contents.clearBody();
                // メッセージのある場合はダイアログを表示
                if (res.message) {
                    alert(res.message);
                }
                // 受け取ったステータスにより画像の表示・非表示
                if (res.state == 200) {
                    ImgInduction.hide();
                    TopButtons.show();
                } else {
                    ImgInduction.show();
                    TopButtons.hide();
                    return;
                }
                // コンテンツのセット
                Contents.setBody(res.Data);
                // 編集フラグのリセット
                isEdit = false;
            }).always(function() {
                // ローディングの非表示
                Loading.hide();
            });
        },
        update: function(url, data) {
            Loading.show();
            $.ajax({
                url: url,
                type: 'POST',
                data: data
            }).done(function(res) {
                // エラーの時はメッセージを表示して終了する
                if (res.state == 404) {
                    alert(res.message);
                    return;
                }
                // コンテンツのクリア
                Contents.clearBody();
                // コンテンツの再セット
                Contents.setBody(res.Data, true);
                // 編集フラグのリセット
                isEdit = false;
            }).always(function() {
                // ローディングの非表示
                Loading.hide();
            });
        }
    };

    // ローディング
    var Loading = {
        // ローディング画面の表示
        show: function() {
            $(Names.mdlLoading.addHash()).removeClass(Names.hidden);
        },
        // ローディング画面の非表示
        hide: function() {
            $(Names.mdlLoading.addHash()).addClass(Names.hidden);
        }
    };

    // 画面上部のボタン群
    var TopButtons = {
        // ボタンを有効化
        show: function() {
            $(Names.cntHeadBtns.addHash()).children('button').removeClass(Names.disabled);
        },
        // ボタンを無効化
        hide: function() {
            $(Names.cntHeadBtns.addHash()).children('button').addClass(Names.disabled);
        }
    };

    // 誘導用画像の表示・非表示
    var ImgInduction ={
        // 誘導用画像のテンプレート（実際にはindexから取得する為空文字でOK）
        tmp: '<img id="' + Names.cntBodyEmptyImg + '" src="img/page-select.png">',
        // indexから誘導画像エレメントをクローンする
        copy: function() {
            ImgInduction.tmp = $(Names.cntBodyEmptyImg.addHash()).clone();
        },
        // 誘導画像の表示
        show: function() {
            $(Names.cntBody.addDot()).first().append($(ImgInduction.tmp));
        },
        // 誘導画像の非表示
        hide: function() {
            $(Names.cntBody.addDot()).find(Names.cntBodyEmptyImg.addHash()).remove();
        }
    };

    var Contents = {
        // 表示しているコンテンツのクリア
        clearBody: function() {
            $(Names.cntBody.addDot()).empty();
        },
        // コンテンツの再セット
        setBody: function(Data, showSuccess) {
            $(window).scrollTop(0);
            // テーブルデータを挿入
            var $wrap = $('<div></div>').attr('id', Names.cntBodyDataWrap);
            $wrap.append($(Data.html));
            $(Names.cntBody.addDot()).first().append($wrap);
            // セレクタブルの設定
            DataTable.addSelectEvent();
            // コンテンツボックスのドラッグアンドドロップ有効化
            Cells.addSortableCol();
            // タイトルを挿入
            var title = Data.in_ex == 1 ? '社内用　' : 'お客さま用　';
            var dates = '<div class="date-update"><span>下書き保存日時</span>：' + (Data.updated !== '0000-00-00 00:00:00' ? Data.updated : '未保存') + '</div>';
            dates += '<div class="date-release"><span>最終更新日時</span>：' + (Data.released !== '0000-00-00 00:00:00' ? Data.released : '未公開') + '</div>';
            title += Data.title;
            $(Names.cntBody.addDot()).first()
                .prepend(
                    $('<div class="note"></div>').text('※セルの結合や行の追加、移動等の操作は、テーブル上で右クリックで表示されるメニューから行ってください。')
                )
                .prepend(
                    $('<div class="dates"></div>').append($(dates))
                )
                .prepend(
                    $('<h2></h2>').text(title)
                                  .addClass('h2-default')
                                  .append(
                                    $('<span></span>').text(Data.name)
                                                      .attr('id', Names.cntName)
                                                       .data(Names.dataUpdate, Data.updated)
                                  )
                );
            // 公開していない場合はアラートパネルを表示
            if (Data.is_release === '0') {
                $(Names.cntBody.addDot()).first().prepend(
                    $('<div></div>').text('公開されていません').addClass(Names.cntBodyPnlAlert)
                );
                $(Names.cntBody.addDot()).first().find('.date-release').first().addClass('alert');
            } else {
                // 公開されている場合は公開済みページへのリンクを表示
                var $h2 = $(Names.cntBody.addDot()).first().find('.h2-default').first();
                $h2.append(
                    $('<a></a>').addClass('pull-right')
                                .addClass('now-page')
                                .attr('href', $('body').data('href') + '/telnumber/' + Data.name)
                                .attr('target', '_blank')
                                .text('本番ページを見る')
                ).append(
                    $('<a></a>').addClass('pull-right')
                                .addClass('now-page')
                                .addClass('now-page')
                                .attr('href', $('body').data('href') + '/staging/bbnavi/telnumber/' + Data.name)
                                .attr('target', '_blank')
                                .text('Stagingページを見る')
                );
                // 一時保存後公開されていない場合はアラートを表示
                if (Data.updated > Data.released) {
                    var updateStr = '下書き保存したデータがStaging環境に公開されていません' + '<br>';
                    updateStr += '<span>下書き保存日時</span>：' + Data.updated + '<br>';
                    updateStr += '<span>最終更新日時</span>：' + Data.released;
                    $(Names.cntBody.addDot()).first().prepend(
                        $('<div></div>').addClass(Names.cntBodyPnlAlert).html(updateStr)
                    );
                    $(Names.cntBody.addDot()).first().find('.date-update').first().addClass('alert');
                    $(Names.cntBody.addDot()).first().find('.date-release').first().addClass('alert');
                }
            }
            // 未保存の場合は下書き保存日の背景を赤にする
            if (Data.updated === '0000-00-00 00:00:00') {
                $(Names.cntBody.addDot()).first().find('.date-update').first().addClass('alert');
            }
            // 削除されている場合はアラートを表示
            if (Data.is_delete === '1') {
                $(Names.cntBody.addDot()).first().prepend(
                    $('<div></div>').text('削除済みデータです').addClass(Names.cntBodyPnlAlert)
                );
            }
            // 完了パネルの表示
            if (showSuccess) {
                // 成功した旨を伝えるパネルの表示
                $(Names.cntBody.addDot()).first().prepend(
                    $('<div></div>').text('更新しました')
                                    .addClass(Names.cntBodyPnlSuccess)
                );
                // 2秒後に消えるようにセットする
                $(Names.cntBodyPnlSuccess.addDot()).fadeOut(2000, function() {$(this).remove();});
            }
        },
        // 下書き保存するボタンを押した時の処理
        save: function() {
            // ページのリンク名等のエレメント
            var $elmName = $(Names.cntName.addHash());
            var url = 'html/save/' + $elmName.text();
            var data = {
                html   : Contents.createSave(),
                updated: $elmName.data(Names.dataUpdate)
            };
            Ajaxs.update(url, data);
        },
        // 本番公開用ページの作成
        publishing: function() {
            // ページのリンク名等のエレメント
            var $elmName = $(Names.cntName.addHash());
            var url = 'html/update/' + $elmName.text();
            var data = {
                html   : Contents.createSave(),
                publish : Contents.createPublish(),
                updated: $elmName.data(Names.dataUpdate)
            };
            Ajaxs.update(url, data);
            Preview.hide();
        },
        // 一時保存用コンテンツの作成
        createSave: function() {
            // htmlコンテンツのラッパーをクローン
            var $html = $(Names.cntBodyDataWrap.addHash()).clone();
            // 不要なクラス等を削除
            $html = Contents.removeRedundant($html);
            // 中身のみを返す
            return $html.html();
        },
        // プレビュー用のコンテンツの作成
        createPreview: function($wrap) {
            var $content = $(Names.cntBodyDataWrap.addHash()).clone();
            // 不要なクラス等を削除
            $content = Contents.removeRedundant($content);
            // 不要なdata属性等を削除
            $content = Contents.removeRedundantData($content);
            // 非表示のエレメントを削除(colspan・rowspanがおかしくなる為削除しない)
            // $content.find(Names.hidden.addDot()).remove();
            // 中に何もないコンテンツの削除
            $content.find(BoxNames.wrap.addDot()).each(function() {
                if ($(this).text().trim() === '') {
                    $(this).remove();
                }
            });
            // ページTOPへコンテンツの挿入
            var pageName = Contents.getPageName();
            var $pagetop = $('<p></p>').addClass('topagetop')
                                       .append(
                                            $('<a></a>').attr('href', 'telnumber/' + pageName)
                                                        .text('ページTOPへ')
                                        );
            $content.find(Names.section.addDot()).append($pagetop);
            $wrap.empty();
            // ページ内リンクの挿入
            $wrap.append(Contents.createUl(pageName));
            // コンテンツを挿入する
            $content.find(Names.section.addDot()).each(function() {
                $wrap.append($(this));
            });
            return $wrap;
        },
        // 本番公開用コンテンツの作成
        createPublish: function() {
            // 本番用のラップコンテンツ
            var $publish = $('<div></div>').attr('id', 'mainmenu')
                                           .attr('name', 'layoutitem_2')
                                           .addClass('layoutitem_a');

            // プレビューと同じものを取得
            var $content = Contents.createPreview($publish);
            // PHPのタグ等を挿入してサーバへ送信したいが、それがPHPのタグを挿入しようとするとエスケープされる為
            // 中身のみをサーバに送信し、サーバ側でその他のタグを足すようにしています
            return $content.html();
        },
        // ページのファイル名を取得
        getPageName: function() {
            var pageName = '';
            if ($(Names.cntName.addHash()).text() !== 'index') {
                pageName = $(Names.cntName.addHash()).text();
            }
            return pageName;
        },
        // ページ内リンクの作成
        createUl: function(pageName) {
            pageName = pageName ? pageName + '/#' : '#';
            var $ul = $('<ul></ul>').attr('id', 'inpage-links');
            $(Names.cntBody.addDot()).first().find(Names.section.addDot()).each(function() {
                var href = 'telnumber/' + pageName + $(this).attr('id');
                $ul.append(
                    $('<li></li>').append(
                        $('<a></a>').attr('href', href)
                                    .text($(this).children('h3').text())
                    )
                );
            });
            return $ul;
        },
        // 不要なクラス等の削除（保存用）
        removeRedundant: function($html) {
            $html.find(Names.hover.addDot()).removeClass(Names.hover);
            $html.find(Names.ctmHover.addDot()).removeClass(Names.ctmHover);
            // jQueryUI selectable関係クラスの削除
            $html.find(Names.uiSelecting.addDot()).removeClass(Names.uiSelecting);
            $html.find(Names.uiSelected.addDot()).removeClass(Names.uiSelected);
            $html.find(Names.uiSelectee.addDot()).removeClass(Names.uiSelectee);
            // 削除予定のクラスの削除
            $html.find(Names.showDelRow.addDot()).removeClass(Names.showDelRow);
            // 移動予定のクラスの削除
            $html.find(Names.showMoveRow.addDot()).removeClass(Names.showMoveRow);
            // セパレータの削除
            $html.find(Names.rowSeparator.addHash()).remove();
            // 行ガイドの削除
            $html.find(Names.hoverRowTop.addHash()).remove();
            $html.find(Names.hoverRowBottom.addHash()).remove();

            return $html;
        },
        // 不要なdata属性等の削除（公開用）
        removeRedundantData: function($html) {
            $html.find('[' + BoxNames.receptionWeekday + ']').removeAttr(BoxNames.receptionWeekday);
            $html.find('[' + BoxNames.receptionSaturday + ']').removeAttr(BoxNames.receptionSaturday);
            $html.find('[' + BoxNames.receptionSunday + ']').removeAttr(BoxNames.receptionSunday);
            $html.find('[' + BoxNames.receptionHoliday + ']').removeAttr(BoxNames.receptionHoliday);
            $html.find('[' + BoxNames.reception365days + ']').removeAttr(BoxNames.reception365days);
            $html.find('[' + BoxNames.receptionAllowed + ']').removeAttr(BoxNames.receptionAllowed);
            $html.find('[' + BoxNames.receptionHourFrom + ']').removeAttr(BoxNames.receptionHourFrom);
            $html.find('[' + BoxNames.receptionTimeFrom + ']').removeAttr(BoxNames.receptionTimeFrom);
            $html.find('[' + BoxNames.receptionTimeTo + ']').removeAttr(BoxNames.receptionTimeTo);
            $html.find('[' + BoxNames.receptionLunch + ']').removeAttr(BoxNames.receptionLunch);
            $html.find('[' + BoxNames.blackOutMay + ']').removeAttr(BoxNames.blackOutMay);
            $html.find('[' + BoxNames.blackOutEndYear + ']').removeAttr(BoxNames.blackOutEndYear);
            $html.find('[' + BoxNames.blackOutOther + ']').removeAttr(BoxNames.blackOutOther);

            // fontタグをspanに変更
            var html = $html.html();
            html = html.replace(/(<\/?)font/gi, "$1span");
            return $html.html(html);
        }
    };

    // プレビュー画面
    var Preview = {
        load: function () {
            $(Names.cntPreview.addHash() + '-wrap').height(($(window).height() - 60));
            var frameHeight = $(Names.cntPreview.addHash() + '-wrap').height() -
                              $(Names.cntPreview.addHash() + '-head').outerHeight() - 30;
            $(Names.cntPreview.addHash() + '-frame-wrap').height(frameHeight - 40);
            $(Names.cntPreview.addHash() + '-frame').height(frameHeight - 40);
        },
        // プレビューの表示
        show: function() {
            $(Names.cntPreview.addHash() + '-frame').attr('src', '');
            $(Names.cntPreview.addHash() + '-frame').attr('src', 'preview').load(function() {
                var $insertContent = $(Names.cntPreview.addHash() + '-frame').contents().find('#mainmenu');
                // プレビューコンテンツの作成
                Contents.createPreview($insertContent);
                // プレビュー画面を表示する
                $(Names.cntPreview.addHash()).show();
            });
        },
        // プレビューの非表示
        hide: function() {
            $(Names.cntPreview.addHash()).hide();
        }
    };



    // テーブルのセル内の操作
    var Cells = {
        // セル内ボックスのテンプレート
        boxTmp: '<div class="' + BoxNames.wrap + '">' +
                '  <div class="' + BoxNames.center + '"></div>' +
                '  <div class="' + BoxNames.address + '"></div>' +
                '  <div class="' + BoxNames.free + '"></div>' +
                '  <div class="' + BoxNames.wrapPhone + '"></div>' +
                '  <div class="' + BoxNames.wrapHp + '">' +
                '    <span class="' + BoxNames.hpPrefix + '"></span>' +
                '    <span class="' + BoxNames.hpAddress + '"></span>' +
                '  </div>' +
                '  <div class="' + BoxNames.wrapMail + '"></div>' +
                '  <div class="' + BoxNames.wrapReception + '">' +
                '    <span class="' + BoxNames.receptionTime + '" ' + BoxNames.receptionAllowed + '="1" ' + BoxNames.receptionHourFrom + '="9" ' + BoxNames.receptionTimeFrom + '="0" ' + BoxNames.receptionHourTo + '="17" ' + BoxNames.receptionTimeTo + '="0" ' + BoxNames.receptionLunch + '="false"></span>' +
                '    <span class="' + BoxNames.receptionDate + '" ' + BoxNames.receptionWeekday + '="false" ' + BoxNames.receptionSaturday + '="false" ' + BoxNames.receptionSunday + '="false" ' + BoxNames.receptionHoliday + '="false" ' + BoxNames.reception365days + '="false"></span>' +
                '    <span class="' + BoxNames.blackOut + '" ' + BoxNames.blackOutMay + '="false" ' + BoxNames.blackOutEndYear + '="false" ' + BoxNames.blackOutOther + '=""></span>' +
                '  </div>' +
                '  <div class="' + BoxNames.other + '"></div>' +
                '</div>',
        // 電話番号用のテンプレート
        phoneTmp: '<div class="' + BoxNames.phoneGroup + '" ' + BoxNames.phoneOtherDate + '="" ' + BoxNames.phoneOtherNumber + '="" ' + BoxNames.phoneOtherState + '="1"' + BoxNames.phoneDefaultNumber + '="">' +
                  '  <span class="' + BoxNames.phonePrefix + '"></span>' +
                  '  <span class="' + BoxNames.phoneNumber + '"></span>' +
                  '  <span class="' + BoxNames.phoneSuffix + '"></span>' +
                  '</div>',
        // メールアドレス用のテンプレート
        mailTmp: '<div class="' + BoxNames.mailGroup + '">' +
                 '  <span class="' + BoxNames.mailPrefix + '"></span>' +
                 '  <span class="' + BoxNames.mailAdress + '"></span>' +
                 '</div>',
        // セル内のコンテンツボックスの移動処理
        addSortableCol: function() {
            var cols = [
                'col1',
                'col2',
                'col3'
            ];
            $.each(cols, function(i, col) {
                $(Names.tblWrap.addDot()).find(col.addDot()).sortable({
                    connectWith: col.addDot(),
                    handle: BoxNames.moveHandle.addHash(),
                    start: function () {
                        isSorting = true;
                        isEdit = true;
                        Events.removeCellHovers();
                        // 不要なクラスの削除
                        var $tables = $(Names.tblWrap.addDot());
                        $tables.find(Names.hover.addDot()).removeClass(Names.hover);
                        $tables.find(Names.ctmHover.addDot()).removeClass(Names.ctmHover);
                        $tables.find(Names.uiSelecting.addDot()).removeClass(Names.uiSelecting);
                        $tables.find(Names.uiSelected.addDot()).removeClass(Names.uiSelected);
                    },
                    stop: function () {
                        isSorting = false;
                        Events.addCellHovers();
                    }
                });
            });
        },
        // 行ごとのコンテンツのドラッグアンドドロップを有効化
        enableSortableCol: function(box) {
            var $table = $(box).parents(Names.tblWrap.addDot()).first();
            var $cell = $(box).parents('th,td').first();
            var cellClass ='';
            switch (true) {
                case $cell.hasClass('col1'):
                    cellClass = 'col1';
                    break;
                case $cell.hasClass('col2'):
                    cellClass = 'col2';
                    break;
                case $cell.hasClass('col3'):
                    cellClass = 'col3';
                    break;
            }
            $(cellClass.addDot()).sortable('enable');
            // $table.find('th,td').sortable('enable');
        },
        // 行ごとのコンテンツのドラッグアンドドロップを無効化
        disableSortableCol: function(box) {
            var $table = $(box).parents(Names.tblWrap.addDot()).first();
            var $cell = $(box).parents('th,td').first();
            var cellClass ='';
            switch (true) {
                case $cell.hasClass('col1'):
                    cellClass = 'col1';
                    break;
                case $cell.hasClass('col2'):
                    cellClass = 'col2';
                    break;
                case $cell.hasClass('col3'):
                    cellClass = 'col3';
                    break;
            }
            $(cellClass.addDot()).sortable('disable');
            // $table.find('th,td').sortable('disable');
        },
        // ボックスの追加ボタンの挿入
        addAddBoxBtn: function(elm) {
            $(elm).append($(Names.btnAddBox.addHash()).removeClass(Names.hidden));
        },
        // ボックスの追加ボタンの削除
        removeAddBoxBtn: function() {
            $('body').append($(Names.btnAddBox.addHash()).addClass(Names.hidden));
        },
        // ボックスの移動用のバーを表示
        addMoveBox: function(elm) {
            $(elm).append($(BoxNames.moveHandle.addHash()).removeClass(Names.hidden));
        },
        // ボックスの移動用のバーの非表示
        removeMoveBox: function() {
            $('body').append($(BoxNames.moveHandle.addHash()).addClass(Names.hidden));
        },
        // ボックスの追加処理
        addBox: function(elm) {
            var $boxTmp = $(Cells.boxTmp);
            $boxTmp.find(BoxNames.wrapPhone.addDot()).first().append($(Cells.phoneTmp));
            $boxTmp.find(BoxNames.wrapMail.addDot()).first().append($(Cells.mailTmp));
            $(elm).before($boxTmp);
            // 追加と同時に編集画面にする
            EditPanel.show($boxTmp.find(BoxNames.wrapPhone.addDot()).first(), true);
            // 編集フラグをセット
            isEdit = true;
        },
        // ボックスの削除処理
        removeBox: function(elm) {
            // 移動バーの避難
            Cells.removeMoveBox();
            // ボックスの削除
            $(elm).remove();
            // 編集フラグをセット
            isEdit = true;
        },
        // ヘッダ編集時に退避しておくクラスのキャッシュ
        cashClass: [],
        // theadの編集開始
        editThead: function(elm) {
            var $elm = $(elm);
            var thWidth = $elm.width() - 30;
            var thTop = $elm.offset().top - $(window).scrollTop() + $elm.height() + 10;
            var thLeft = $elm.offset().left - $(window).scrollLeft();
            var thTitle = $elm.text();
            var thClass = $elm.attr('class');
            var classArr = thClass.split(' ');
            // 退避しておくクラスのリスト
            var delClass = [
                'col1',
                'col2',
                'col3',
                'ui-sortable',
                'ui-sortable-disabled'
            ];
            // キャッシュ用配列の初期化
            Cells.cashClass = [];
            // 退避しておくものと、表示するものに切り分ける
            for (var i = 0, len = classArr.length; i < len; i++) {
                if ($.inArray(classArr[i], delClass) > -1) {
                    // 退避
                    Cells.cashClass.push(classArr[i]);
                    // 削除
                    delete(classArr[i]);
                }
            }
            $elm.addClass(Names.selected);
            $(Names.headEdit.addHash() + '-title').val(thTitle);
            $(Names.headEdit.addHash() + '-class').val(classArr.join(' ').trim());
            $(Names.headEdit.addHash()).data(Names.dataTargetElm, $elm);
            $(Names.headEdit.addHash()).css({
                top: thTop,
                left: thLeft,
                width: thWidth
            });
            $(Names.headEdit.addHash() + '-wrap').show();
        },
        // theadの編集確定
        updateThead: function(elm) {
            var $elm = $($(Names.headEdit.addHash()).data(Names.dataTargetElm));
            $elm.text($(Names.headEdit.addHash() + '-title').val());
            $elm.attr('class', '');
            $elm.addClass($(Names.headEdit.addHash() + '-class').val());
            for (var i = 0, len = Cells.cashClass.length; i < len; i++) {
                $elm.addClass(Cells.cashClass[i]);
            }
            Cells.cancelThead();
            // 編集フラグをセット
            isEdit = true;
        },
        // theadの編集キャンセル
        cancelThead: function(elm) {
            var pnl = $(Names.headEdit.addHash()).data(Names.dataTargetElm);
            $(pnl).removeClass(Names.selected);
            $(Names.headEdit.addHash() + '-wrap').hide();
        },
        // tfootの編集開始
        editTfoot: function(elm) {
            Events.removeTfoot();
            var html = $(elm).html() || '';
            $(elm).empty().addClass('edit');
            var $textarea = $('<textarea></textarea>');
            $(elm).append($textarea.val(html.br2nl()));
            $textarea.trigger('focus');
        },
        // tfootの編集終了
        updateTfoot: function(elm) {
            Events.addTfoot();
            var html = $(elm).val();
            var $td = $(elm).parents('td').first();
            $td.empty();
            $td.removeClass('edit').html(html.nl2br());
            // 編集フラグをセット
            isEdit = true;
        }
    };

    // セルの編集パネルでの処理
    var EditPanel = {
        // 電話部分のテンプレート
        phoneTmp: '<fieldset class="' + EditNames.phoneGroup + '">' +
                  '  <label class="pull-left w-170">' +
                  '    見出し' +
                  '    <input class="' + EditNames.phonePrefix + '" type="text">' +
                  '  </label>' +
                  '  <label class="pull-left w-155 mg-l-5">' +
                  '    番号' +
                  '    <input class="' + EditNames.phoneNumber + '" type="text">' +
                  '  </label>' +
                  '  <label class="pull-left w-170 mg-l-5">' +
                  '    後カッコ' +
                  '    <input class="' + EditNames.phoneSuffix + '" type="text">' +
                  '  </label>' +
                  '  <label class="pull-left w-170">' +
                  '    <input class="' + EditNames.phoneOtherDate + '" type="text" readonly>' +
                  '  </label>' +
                  '  <div class="pull-left central w-140 mg-b-5" readonly>' +
                  '    <select class="' + EditNames.phoneOtherState + '">' +
                  '        <option value="1">からの</option>' +
                  '        <option value="2">までの</option>' +
                  '    </select>' +
                  '    電話番号' +
                  '  </div>' +
                  '  <label class="pull-left w-140">' +
                  '    <input class="' + EditNames.phoneOtherNumber + '" type="text" placeholder="電話番号">' +
                  '  </label>' +
                  '  <button class="btn-del-phone btn btn-danger pull-left mg-l-5" type="button">削除</button>' +
                  '</fieldset>',
        // メール部分のテンプレート
        mailTmp: '<fieldset class="' + EditNames.mailGroup + '">' +
                 '  <label class="pull-left w-160">' +
                 '    見出し' +
                 '    <input class="' + EditNames.mailPrefix + '" type="text">' +
                 '  </label>' +
                 '  <label class="pull-left w-285 mg-l-5">' +
                 '    アドレス' +
                 '    <input class="' + EditNames.mailAdress + '" type="text">' +
                 '  </label>' +
                 '  <label class="btn-del-mail-wrap">' +
                 '  　' +
                 '    <button class="btn-del-mail btn btn-danger pull-left mg-l-5" type="button">削除</button>' +
                 '  </label>' +
                 '</fieldset>',
        // セル内コンテンツブロックの編集パネル表示
        show: function(elm, state) {
            var $editBox = $(elm).parents(BoxNames.wrap.addDot()).first();
            $(EditNames.panel.addHash()).data(Names.dataTargetElm, $editBox);
            // 新規追加で開いたか、編集で開いたかの確認用（新規の時はキャンセルボタンで削除）
            $(EditNames.panel.addHash()).data('addState', state || false);
            Cells.removeMoveBox();
            // パネルの高さを設定
            var boxHeight = $(window).height() - 150;
            $(EditNames.panel.addHash() + '-left').height(boxHeight);
            $(EditNames.panel.addHash() + '-right').height(boxHeight - 40);
            $(EditNames.panel.addHash() + '-preview-wrap').height(boxHeight - 60);
            // プレビュー画面と編集パネルにデータを反映
            var $boxData = $editBox.clone().removeClass(BoxNames.wrap);
            $(EditNames.panel.addHash() + '-preview').empty();
            $(EditNames.panel.addHash() + '-preview').append($boxData.html());

            // パネル内のデータの初期化
            EditPanel.reset($(EditNames.panel.addHash()));
            // 読み込んだデータをパネルに反映
            EditPanel.readVal($(EditNames.panel.addHash()));
            // カラムにより編集項目を変更する
            EditPanel.setEditItem($(EditNames.panel.addHash()), $editBox);
            // モーダルの表示
            $(EditNames.panel.addHash()).modal();
            // パネルを最上部にスクロール
            $(EditNames.panel.addHash() + '-left').scrollTop(0);
            // 先頭のセルにフォーカスを移動
            $(EditNames.panel.addHash()).find('input').first().focus();
        },
        // 編集パネルを閉じるときの処理
        hide: function(e) {
            var $editBox = $(EditNames.panel.addHash()).data(Names.dataTargetElm);
            var $targetTable = $editBox.parents('table').first();
            // ホバークラスの削除
            $targetTable.find(Names.hover.addDot()).removeClass(Names.hover);
            $targetTable.find(Names.ctmHover.addDot()).removeClass(Names.ctmHover);
        },
        // テキストエリアをWYSWYGに変換
        setWyswyg: function() {
            $(EditNames.editBox.addDot()).each(function () {
                var $this = $(this);
                // ボタンを挿入するためのラップ
                var $wrap = $('<div></div>').addClass(EditNames.editBox + '-wrap');
                // 編集エリア用のラップ
                var $editBox = $('<div></div>').addClass(EditNames.editBox + '-editbox');
                $editBox.data('composition', false);
                $editBox.prop('contenteditable', true);
                $editBox.on('keyup cut paste', function () {
                    setTimeout(function () {
                        if (!$this.data('composition')) {
                            $this.val($editBox.html()).trigger('input');
                        }
                    }, 0);
                }).on('compositionstart', function () {
                    $editBox.data('composition', true);
                }).on('compositionend', function () {
                    $editBox.data('composition', false);
                });
                // リンク挿入用のボックス
                var $linkbox = $('<div></div>').addClass('edit-link').css({'display': 'none'});
                $linkbox.append($('<input>').attr('type', 'text').addClass('edit-link-input'));
                $linkbox.append(
                    $('<label></label>').html('<input type="checkbox", class="edit-link-blank"> target=&quot;_blank&quot;にする').addClass('edit-link-blank-label')
                );
                $linkbox.append($('<button></button>').attr('type', 'button').addClass('edit-link-submit').text('更新'));
                $linkbox.append($('<button></button>').attr('type', 'button').addClass('edit-link-cancel').text('キャンセル'));
                // ボタン群
                var $btns = $('<div></div>').addClass('edit-link-btns')
                                .append(
                                    $('<button></button>').attr('type', 'button').addClass('small').text('小文字')
                                ).append(
                                    $('<button></button>').attr('type', 'button').addClass('red').text('赤字')
                                ).append(
                                    $('<button></button>').attr('type', 'button').addClass('bold').text('太字')
                                ).append(
                                    $('<button></button>').attr('type', 'button').addClass('link').text('リンク')
                                ).append(
                                    $('<button></button>').attr('type', 'button').addClass('mail').text('メール')
                                ).append(
                                    $('<button></button>').attr('type', 'button').addClass('reset').text('書式の取消')
                                ).append(
                                    $('<button></button>').attr('type', 'button').addClass('source').text('ソースの表示')
                                );

                // エレメントの後ろにラップを挿入
                $this.after($wrap);
                // ラップにボタンを挿入
                $wrap.append($btns);
                // リンク編集パネルを表示
                $wrap.append($linkbox);
                // 編集パネルを挿入
                $wrap.append($editBox);
                // 入力エリアをラップに挿入
                $wrap.append($this);
                $this.hide();
            });
        },
        // セル内コンテンツの編集内容の更新処理
        update: function() {
            var $editBox = $(EditNames.panel.addHash()).data(Names.dataTargetElm);
            $editBox.empty();
            $editBox.append($($(EditNames.panel.addHash() + '-preview').html()));
            $(EditNames.panel.addHash()).modal('hide');
            // 編集フラグのセット
            isEdit = true;
        },
        // 編集のあった時にプレビューに反映する
        setVal: function(elm) {
            var $elm = $(elm);
            var $preview = $(EditNames.panel.addHash() + '-preview');
            var val = $elm.val();
            var $boxElm;
            var $val;
            // scriptという文字を削除
            val = val.replace(/(<\/?)script/gi, "$1span");
            if ($elm.is('[id="' + EditNames.center + '"]')) {
                // センタ名
                $boxElm = $preview.find(BoxNames.center.addDot()).first();
                $boxElm.empty();
                if (val !== '') {
                    $boxElm.html(val.addSumi());
                }
            } else if ($elm.is('[id="' + EditNames.address + '"]')) {
                // 住所
                $boxElm = $preview.find(BoxNames.address.addDot()).first();
                $boxElm.empty();
                if (val !== '') {
                    // 文字数を確認
                    $val = $('<div>' + val + '</div>');
                    if ($val.text().length > 200) {
                        // 200文字より多い場合は前の値をそのまま使用
                        val = $elm.data('prevVal');
                        // テキストエリアの値を元に戻す
                        $elm.val(val);
                        // 入力エリアの値を元に戻す
                        $elm.parents(EditNames.editBox.addDot() + '-wrap').first()
                            .find(EditNames.editBox.addDot() + '-editbox').first()
                            .html(val);
                        alert('文字数は200文字以内で入力してください');
                    }
                    $boxElm.html(val);
                    $boxElm.nextAll().each(function() {
                        if ($(this).text().trim() !== '') {
                            $boxElm.append('<br><br>');
                            return false;
                        }
                    });
                }
                // 前回値としての値をセット
                $elm.data('prevVal', val);
            } else if ($elm.is('[id="' + EditNames.hpPrefix + '"]')) {
                // ホームページの接頭句
                $boxElm = $preview.find(BoxNames.hpPrefix.addDot()).first();
                $boxElm.empty();
                if (val !== '') {
                    $boxElm.html(val.addSumi() + '<br>');
                }
            } else if ($elm.is('[id="' + EditNames.hpAddress + '"]')) {
                // ホームページアドレス
                $boxElm = $preview.find(BoxNames.hpAddress.addDot()).first();
                $boxElm.empty();
                if (val !== '') {
                    $boxElm.append(
                        $('<a></a>').text(val)
                                    .attr('href', val)
                    );
                }
            } else if ($elm.is('[id="' + EditNames.other + '"]')) {
                // その他項目
                $boxElm = $preview.find(BoxNames.other.addDot()).first();
                $boxElm.empty();
                if (val !== '') {
                    // 文字数を確認
                    $val = $('<div>' + val + '</div>');
                    if ($val.text().length >= 200) {
                        // 200文字より多い場合は前の値をそのまま使用
                        val = $elm.data('prevVal');
                        // テキストエリアの値を元に戻す
                        $elm.val(val);
                        // 入力エリアの値を元に戻す
                        $elm.parents(EditNames.editBox.addDot() + '-wrap').first()
                            .find(EditNames.editBox.addDot() + '-editbox').first()
                            .html(val);
                        alert('文字数は200文字以内で入力してください');
                    }
                    $boxElm.html(val);
                }
                // 前回値としての値をセット
                $elm.data('prevVal', val);
            } else if ($elm.is('[class|="edit-phone"]')) {
                // 電話番号項目
                EditPanel.setPhoneVal();
            } else if ($elm.is('[class|="edit-mail"]')) {
                // メールアドレス項目
                EditPanel.setMailVal();
            } else if ($elm.is('[id|="rcpd"]')) {
                // 受付日項目
                EditPanel.setReceptionDateVal($(elm));
            } else if ($elm.is('[id|="rcpt"]')) {
                // 受付時間項目
                EditPanel.setReceptionTimeVal($(elm));
            } else if ($elm.is('[id|="bko"]')) {
                // 除外日項目
                EditPanel.setReceptionBlackOutVal();
            }
        },
        // 日付が正しいかのチェック
        // 電話番号の値をセット
        setPhoneVal: function() {
            var $wrap = $(EditNames.panel.addHash() + '-preview').find(BoxNames.wrapPhone.addDot()).first();
            $wrap.empty();

            $(EditNames.phoneGroup.addDot()).each(function() {
                var $phoneTmp = $(Cells.phoneTmp);
                var pre = $(this).find(EditNames.phonePrefix.addDot()).first().val();
                var num = $(this).find(EditNames.phoneNumber.addDot()).first().val();
                var suf = $(this).find(EditNames.phoneSuffix.addDot()).first().val();
                $phoneTmp.find(BoxNames.phonePrefix.addDot()).first().html(pre === ''? '': pre.addSumi() + '<br>');
                $phoneTmp.find(BoxNames.phoneNumber.addDot()).first().html(num === ''? '': '<em>' + num + '</em>');
                $phoneTmp.find(BoxNames.phoneSuffix.addDot()).first().html(suf === ''? '': '(' + suf + ')<br>');

                var otherState = $(this).find(EditNames.phoneOtherState.addDot()).first().val();
                var otherDate = $(this).find(EditNames.phoneOtherDate.addDot()).first().val();
                var otherNum = $(this).find(EditNames.phoneOtherNumber.addDot()).first().val();
                $phoneTmp.attr(BoxNames.phoneDefaultNumber, num);
                $phoneTmp.attr(BoxNames.phoneOtherState, otherState);
                $phoneTmp.attr(BoxNames.phoneOtherDate, otherDate);
                $phoneTmp.attr(BoxNames.phoneOtherNumber, otherNum);

                $wrap.append($phoneTmp);
            });
            // 電話番号の○○○○年○○月○○日までの表示
            phoneOther.set();
        },
        // メールアドレスをセット
        setMailVal: function() {
            var $wrap = $(EditNames.panel.addHash() + '-preview').find(BoxNames.wrapMail.addDot()).first();
            $wrap.empty();

            $(EditNames.mailGroup.addDot()).each(function() {
                var $mailTmp = $(Cells.mailTmp);
                var prefix = $(this).find(EditNames.mailPrefix.addDot()).first().val();
                var address = $(this).find(EditNames.mailAdress.addDot()).first().val();
                $mailTmp.find(BoxNames.mailPrefix.addDot()).first().html(prefix === ''? '': prefix.addSumi() + '<br>');
                $mailTmp.find(BoxNames.mailAdress.addDot()).first().empty();
                if (address !== '') {
                    $mailTmp.find(BoxNames.mailAdress.addDot()).first().append(
                        $('<a></a>').text(address)
                                    .attr('href', 'mailto:' + address)
                    );
                }

                $wrap.append($mailTmp);
            });
        },
        // 受付日をセット
        setReceptionDateVal: function($elm) {
            var $wrap = $(EditNames.panel.addHash() + '-preview').find(BoxNames.receptionDate.addDot()).first();
            $wrap.empty($wrap);

            var str = '';
            var strArr = [];
            // var id = $elm.attr('id');
            if ($(EditNames.reception365days.addHash()).prop('checked')) {
                    strArr.push('年中無休');
            } else {
                if ($(EditNames.receptionWeekday.addHash()).prop('checked')) {
                    strArr.push('平日');
                }
                if ($(EditNames.receptionSaturday.addHash()).prop('checked')) {
                    strArr.push('土曜');
                }
                if ($(EditNames.receptionSunday.addHash()).prop('checked')) {
                    strArr.push('日曜');
                }
                if ($(EditNames.receptionHoliday.addHash()).prop('checked')) {
                    strArr.push('祝日');
                }
            }
            str = strArr.join('・');
            if (str) {
                str = '受付日：' + str + '<br>';
            }
            $wrap.attr(BoxNames.receptionWeekday, $(EditNames.receptionWeekday.addHash()).prop('checked'));
            $wrap.attr(BoxNames.receptionSaturday, $(EditNames.receptionSaturday.addHash()).prop('checked'));
            $wrap.attr(BoxNames.receptionSunday, $(EditNames.receptionSunday.addHash()).prop('checked'));
            $wrap.attr(BoxNames.receptionHoliday, $(EditNames.receptionHoliday.addHash()).prop('checked'));
            $wrap.attr(BoxNames.reception365days, $(EditNames.reception365days.addHash()).prop('checked'));
            $wrap.html(str);
            EditPanel.setReceptionDateCheck();
        },
        // 受付日のチェックボックスをセット
        setReceptionDateCheck: function() {
            if ($(EditNames.reception365days.addHash()).prop('checked')) {
                // 年中無休にチェックが入っているときの処理
                $(EditNames.receptionWeekday.addHash()).prop('checked', false).prop('disabled', true);
                $(EditNames.receptionSaturday.addHash()).prop('checked', false).prop('disabled', true);
                $(EditNames.receptionSunday.addHash()).prop('checked', false).prop('disabled', true);
                $(EditNames.receptionHoliday.addHash()).prop('checked', false).prop('disabled', true);
            } else if ($(EditNames.receptionWeekday.addHash()).prop('checked') &&
                       $(EditNames.receptionSaturday.addHash()).prop('checked') &&
                       $(EditNames.receptionSunday.addHash()).prop('checked') &&
                       $(EditNames.receptionHoliday.addHash()).prop('checked')) {
                // 年中無休以外の全てにチェックが入っているときの処理 //
                $(EditNames.reception365days.addHash()).prop('checked', true);
                EditPanel.setReceptionDateVal();
            } else {
                $(EditNames.receptionWeekday.addHash()).prop('disabled', false);
                $(EditNames.receptionSaturday.addHash()).prop('disabled', false);
                $(EditNames.receptionSunday.addHash()).prop('disabled', false);
                $(EditNames.receptionHoliday.addHash()).prop('disabled', false);
            }
        },
        // 受付時間をセット
        setReceptionTimeVal: function($elm) {
            var $wrap = $(EditNames.panel.addHash() + '-preview').find(BoxNames.receptionTime.addDot()).first();
            $wrap.empty();

            var str = '';
            var state = $('[name="' + EditNames.receptionTimeName + '"]:checked').val();

            switch (state) {
                case '2':
                    $(EditNames.receptionHourFrom.addHash()).prop('disabled', false);
                    $(EditNames.receptionTimeFrom.addHash()).prop('disabled', false);
                    $(EditNames.receptionHourTo.addHash()).prop('disabled', false);
                    $(EditNames.receptionTimeTo.addHash()).prop('disabled', false);
                    $(EditNames.receptionLunch.addHash()).prop('disabled', false);
                    str += $(EditNames.receptionHourFrom.addHash()).val() + ':';
                    str += $(EditNames.receptionTimeFrom.addHash()).val().padZero() + '～';
                    str += $(EditNames.receptionHourTo.addHash()).val() + ':';
                    str += $(EditNames.receptionTimeTo.addHash()).val().padZero();
                    if ($(EditNames.receptionLunch.addHash()).prop('checked')) {
                        str += '(12時～13時を除く)';
                    }
                    break;
                case '3':
                    str = '24時間';
                case '1':
                    $(EditNames.receptionHourFrom.addHash()).prop('disabled', true);
                    $(EditNames.receptionTimeFrom.addHash()).prop('disabled', true);
                    $(EditNames.receptionHourTo.addHash()).prop('disabled', true);
                    $(EditNames.receptionTimeTo.addHash()).prop('disabled', true);
                    $(EditNames.receptionLunch.addHash()).prop('disabled', true);
                    break;
            }
            $wrap.attr(BoxNames.receptionAllowed, state);
            $wrap.attr(BoxNames.receptionHourFrom, $(EditNames.receptionHourFrom.addHash()).val());
            $wrap.attr(BoxNames.receptionTimeFrom, $(EditNames.receptionTimeFrom.addHash()).val());
            $wrap.attr(BoxNames.receptionHourTo, $(EditNames.receptionHourTo.addHash()).val());
            $wrap.attr(BoxNames.receptionTimeTo, $(EditNames.receptionTimeTo.addHash()).val());
            $wrap.attr(BoxNames.receptionLunch, $(EditNames.receptionLunch.addHash()).prop('checked'));
            if (str) {
                str = '受付時間：' + str + '<br>';
            }
            $wrap.html(str);
        },
        // 除外日をセット
        setReceptionBlackOutVal: function() {
            var $wrap = $(EditNames.panel.addHash() + '-preview').find(BoxNames.blackOut.addDot()).first();
            $wrap.empty();

            var str = '';
            var strArr = [];
            if ($(EditNames.blackOutOther.addHash()).val() !== '') {
                strArr.push($(EditNames.blackOutOther.addHash()).val());
            }
            if ($(EditNames.blackOutMay.addHash()).prop('checked')) {
                strArr.push('5/3～5/5');
            }
            if ($(EditNames.blackOutEndYear.addHash()).prop('checked')) {
                strArr.push('年末年始12/29～1/3');
            }
            $wrap.attr(BoxNames.blackOutOther, $(EditNames.blackOutOther.addHash()).val());
            $wrap.attr(BoxNames.blackOutMay, $(EditNames.blackOutMay.addHash()).prop('checked'));
            $wrap.attr(BoxNames.blackOutEndYear, $(EditNames.blackOutEndYear.addHash()).prop('checked'));
            str = strArr.join('・');
            if (str) {
                str = '(' + str + 'を除く)';
            }
            $wrap.html(str);
        },
        // 読み込んだデータをパネルの入力画面にセットする
        readVal: function($elm) {
            var $preview = $elm.find(EditNames.panel.addHash() + '-preview');
            // センタ名
            var centerVal = $preview.find(BoxNames.center.addDot()).first().text().trimEx();
            if (centerVal !== '') {
                $(EditNames.center.addHash()).val(centerVal);
                EditPanel.showInputParentSection($(EditNames.center.addHash()));
            }
            // 住所等
            var addressVal = $preview.find(BoxNames.address.addDot()).first().html();
            // 前回値としての値をセット
            $(EditNames.address.addHash()).data('prevVal', addressVal);
            if (addressVal !== '') {
                $(EditNames.address.addHash()).val(addressVal);
                $(EditNames.address.addHash()).parents(EditNames.editBox.addDot() + '-wrap').first().find(EditNames.editBox.addDot() + '-editbox').first().html(addressVal);
                EditPanel.showInputParentSection($(EditNames.address.addHash()));
            }
            // 電話番号
            $preview.find(BoxNames.phoneGroup.addDot()).each(function(iPhone) {
                if (iPhone < 1) {
                    EditPanel.showInputParentSection($(EditNames.phoneGroupWrap.addHash()));
                }
                var $phoneTmp = $(EditPanel.phoneTmp);
                var phonePre = $(this).children(BoxNames.phonePrefix.addDot()).first().text().trimEx();
                var phoneSuf = $(this).children(BoxNames.phoneSuffix.addDot()).first().text().trimEx();
                $phoneTmp.find(EditNames.phonePrefix.addDot()).first().val(phonePre);
                $phoneTmp.find(EditNames.phoneSuffix.addDot()).first().val(phoneSuf);

                var otherState = $(this).attr(BoxNames.phoneOtherState) || '';
                var otherDate = $(this).attr(BoxNames.phoneOtherDate) || '';
                var otherNum = $(this).attr(BoxNames.phoneOtherNumber) || '';
                var defaultNum = $(this).attr(BoxNames.phoneDefaultNumber) || '';
                $phoneTmp.find(EditNames.phoneNumber.addDot()).first().val(defaultNum);
                $phoneTmp.find(EditNames.phoneOtherState.addDot()).first().val(otherState.toInt());
                $phoneTmp.find(EditNames.phoneOtherDate.addDot()).first().val(otherDate);
                $phoneTmp.find(EditNames.phoneOtherNumber.addDot()).first().val(otherNum);

                $(EditNames.phoneGroupWrap.addHash()).append($phoneTmp);
            });
            EditPanel.setPhoneDelBtn();
            // ホームページプレフィクス
            var hpPreVal = $preview.find(BoxNames.hpPrefix.addDot()).first().text().trimEx();
            if (hpPreVal !== '') {
                $(EditNames.hpPrefix.addHash()).val(hpPreVal);
                EditPanel.showInputParentSection($(EditNames.hpPrefix.addHash()));
            }
            // ホームページ
            var hpVal = $preview.find(BoxNames.hpAddress.addDot()).first().children('a').first().text();
            if (hpVal !== '') {
                $(EditNames.hpAddress.addHash()).val(hpVal);
                EditPanel.showInputParentSection($(EditNames.hpAddress.addHash()));
            }
            // メール
            $preview.find(BoxNames.mailGroup.addDot()).each(function(iMail) {
                var $mailTmp = $(EditPanel.mailTmp);
                var mailPre = $(this).children(BoxNames.mailPrefix.addDot()).first().text().trimEx();
                var mailAdrs = $(this).children(BoxNames.mailAdress.addDot()).first().children('a').first().text();
                $mailTmp.find(EditNames.mailPrefix.addDot()).first().val(mailPre);
                $mailTmp.find(EditNames.mailAdress.addDot()).first().val(mailAdrs);
                $(EditNames.mailGroupWrap.addHash()).append($mailTmp);
                if (iMail < 1 && mailPre !== '' && mailAdrs !== '') {
                    EditPanel.showInputParentSection($(EditNames.mailGroupWrap.addHash()));
                }
            });
            EditPanel.setMailDelBtn();
            // 受付時間
            var $brt = $preview.find(BoxNames.receptionTime.addDot()).first();
            $(EditNames.receptionHourFrom.addHash()).val($brt.attr(BoxNames.receptionHourFrom) || 9);
            $(EditNames.receptionTimeFrom.addHash()).val($brt.attr(BoxNames.receptionTimeFrom) || 0);
            $(EditNames.receptionHourTo.addHash()).val($brt.attr(BoxNames.receptionHourTo) || 17);
            $(EditNames.receptionTimeTo.addHash()).val($brt.attr(BoxNames.receptionTimeTo) || 0);
            $(EditNames.receptionLunch.addHash()).prop('checked', $brt.attr(BoxNames.receptionLunch) === "true" ? true : false);
            if ($('input[name="' + EditNames.receptionTimeName + '"]:checked').val() !== '1') {
                EditPanel.showInputParentSection($(EditNames.receptionHourFrom.addHash()));
            }
            $('input[name="' + EditNames.receptionTimeName + '"]').val([$brt.attr(BoxNames.receptionAllowed) || 1]).change();
            // 受付日
            var $brd = $preview.find(BoxNames.receptionDate.addDot()).first();
            $(EditNames.receptionWeekday.addHash()).prop('checked', $brd.attr(BoxNames.receptionWeekday) === "true" ? true : false);
            $(EditNames.receptionSaturday.addHash()).prop('checked', $brd.attr(BoxNames.receptionSaturday) === "true" ? true : false);
            $(EditNames.receptionSunday.addHash()).prop('checked', $brd.attr(BoxNames.receptionSunday) === "true" ? true : false);
            $(EditNames.receptionHoliday.addHash()).prop('checked', $brd.attr(BoxNames.receptionHoliday) === "true" ? true : false);
            $(EditNames.reception365days.addHash()).prop('checked', $brd.attr(BoxNames.reception365days) === "true" ? true : false);
            if ($(EditNames.receptionWeekday.addHash()).prop('checked') ||
                $(EditNames.receptionSaturday.addHash()).prop('checked') ||
                $(EditNames.receptionSunday.addHash()).prop('checked') ||
                $(EditNames.receptionHoliday.addHash()).prop('checked') ||
                $(EditNames.reception365days.addHash()).prop('checked')) {
                EditPanel.showInputParentSection($(EditNames.receptionWeekday.addHash()));
            }
            // 受付休み
            var $brb = $preview.find(BoxNames.blackOut.addDot()).first();
            $(EditNames.blackOutMay.addHash()).prop('checked', $brb.attr(BoxNames.blackOutMay) === "true" ? true : false);
            $(EditNames.blackOutEndYear.addHash()).prop('checked', $brb.attr(BoxNames.blackOutEndYear) === "true" ? true : false);
            $(EditNames.blackOutOther.addHash()).val($brb.attr(BoxNames.blackOutOther));
            if ($(EditNames.blackOutMay.addHash()).prop('checked') ||
                $(EditNames.blackOutEndYear.addHash()).prop('checked') ||
                $(EditNames.blackOutOther.addHash()).val() !== '') {
                EditPanel.showInputParentSection($(EditNames.blackOutMay.addHash()));
            }
            // その他
            var otherVal = $preview.find(BoxNames.other.addDot()).first().html();
            // 前回値としての値をセット
            $(EditNames.other.addHash()).data('prevVal', otherVal);
            if (otherVal !== '') {
                $(EditNames.other.addHash()).val(otherVal);
                $(EditNames.other.addHash()).parents(EditNames.editBox.addDot() + '-wrap').first().find(EditNames.editBox.addDot() + '-editbox').first().html(otherVal);
                EditPanel.showInputParentSection($(EditNames.other.addHash()));
            }
            // 受付日のチェックボックスをセットする
            EditPanel.setReceptionDateVal($elm);
            // 電話の日付プラグインを初期化する
            EditPanel.setDatePicker();
        },
        // 編集パネル内項目の表示
        showInputParentSection: function($elm) {
            $elm.parents('.edit-section').first().children('.edit-section-title').first().removeClass('close');
            $elm.parents('.edit-section').first().children('fieldset').show();
        },
        // 編集パネル内のデータのクリア
        reset: function($elm) {
            $elm.find(EditNames.center.addHash()).val('');
            $elm.find(EditNames.address.addHash()).val('');
            $elm.find(EditNames.phoneGroup.addDot()).remove();
            $elm.find(EditNames.hpPrefix.addHash()).val('');
            $elm.find(EditNames.hpAddress.addHash()).val('');
            $elm.find(EditNames.hpAddress.addHash()).parents(EditNames.editBox.addDot() + '-wrap').first().find(EditNames.editBox.addDot() + '-editbox').first().html('');
            $elm.find(EditNames.mailGroup.addDot()).remove();
            $elm.find(EditNames.receptionWeekday.addHash()).first().prop('checked', false).prop('disabled', false);
            $elm.find(EditNames.receptionSaturday.addHash()).first().prop('checked', false).prop('disabled', false);
            $elm.find(EditNames.receptionSunday.addHash()).first().prop('checked', false).prop('disabled', false);
            $elm.find(EditNames.receptionHoliday.addHash()).first().prop('checked', false).prop('disabled', false);
            $elm.find(EditNames.reception365days.addHash()).first().prop('checked', false).prop('disabled', false);
            $elm.find(EditNames.receptionNothing.addHash()).first().prop('checked', true);
            $elm.find(EditNames.receptionHourFrom.addHash()).val(9).prop('disabled', true);
            $elm.find(EditNames.receptionTimeFrom.addHash()).val(0).prop('disabled', true);
            $elm.find(EditNames.receptionHourTo.addHash()).val(17).prop('disabled', true);
            $elm.find(EditNames.receptionTimeTo.addHash()).val(0).prop('disabled', true);
            $elm.find(EditNames.receptionLunch.addHash()).first().prop('checked', false);
            $elm.find(EditNames.blackOutMay.addHash()).first().prop('checked', false);
            $elm.find(EditNames.blackOutEndYear.addHash()).first().prop('checked', false);
            $elm.find(EditNames.blackOutOther.addHash()).val('');
            $elm.find(EditNames.other.addHash()).val('');
            $elm.find(EditNames.other.addHash()).parents(EditNames.editBox.addDot() + '-wrap').first().find(EditNames.editBox.addDot() + '-editbox').first().html('');

            // テキストエリアの入力を編集エリアに変更
            $(EditNames.editBox.addDot() + '-editbox').hide();
            $('.source').click();
            // 編集パネルのフィールドをいったん閉じる
            $elm.find('.edit-section-title').addClass('close');
            $elm.find('fieldset[id|=field]').hide();
        },
        // 編集項目のセット
        setEditItem: function($edit, $box) {
            var colClass = '';
            var $col = $box.parents('th,td').first();
            if ($col.hasClass('col1')) {
                colClass = 'col1';
            } else if ($col.hasClass('col2')) {
                colClass = 'col2';
            } else if ($col.hasClass('col3')) {
                colClass = 'col3';
            }

            if (colClass === 'col1') {
                $edit.find('.edit-section').addClass(Names.hidden);
                // 住所項目をデフォルトでオープンにする
                $edit.find(EditNames.fieldAddress.addHash()).prev().removeClass('close');
                $edit.find(EditNames.fieldAddress.addHash()).show();
            } else {
                $edit.find('.edit-section').removeClass(Names.hidden);
            }
            // 住所項目のみ入力可とする
            $edit.find(EditNames.fieldAddress.addHash()).parents('.edit-section').first().removeClass(Names.hidden);
        },
        // 電話番号の追加
        addPhone: function(elm) {
            $(EditNames.phoneGroupWrap.addHash()).append($(EditPanel.phoneTmp));
            EditPanel.setPhoneDelBtn();
            EditPanel.setDatePicker();
        },
        // 電話番号の削除
        delPhone: function(elm) {
            $(elm).parents('fieldset').first().remove();
            EditPanel.setPhoneDelBtn();
            EditPanel.setPhoneVal();
        },
        // 電話番号の削除ボタンのセット
        setPhoneDelBtn: function() {
            // 一旦全てのボタンの削除
            $(EditNames.btnPhoneDel.addDot()).remove();
            // 2個以上なら削除ボタンのセット
            if ($(EditNames.phoneGroup.addDot()).length > 1) {
                $(EditNames.phoneGroup.addDot()).each(function() {
                    $(this).append(
                        $('<button></button>').text('削除')
                                              .attr('type', 'button')
                                              .addClass('btn-del-phone btn btn-danger pull-left mg-l-5')
                    );
                });
            }
            EditPanel.addChangeEvent();
        },
        // メールアドレスの追加
        addMail: function(elm) {
            $(EditNames.mailGroupWrap.addHash()).append($(EditPanel.mailTmp));
            EditPanel.setMailDelBtn();
        },
        // メールアドレスの削除
        delMail: function(elm) {
            $(elm).parents('fieldset').first().remove();
            EditPanel.setMailDelBtn();
            EditPanel.setMailVal();
        },
        // メールの削除ボタンのセット
        setMailDelBtn: function() {
            // 一旦全てのボタンの削除
            $(EditNames.btnMailDelWrap.addDot()).remove();
            // 2個以上なら削除ボタンのセット
            if ($(EditNames.mailGroup.addDot()).length > 1) {
                $(EditNames.mailGroup.addDot()).each(function() {
                    var $lavel = $('<label></label>').addClass(EditNames.btnMailDelWrap);
                    $lavel.append('　')
                          .append(
                            $('<button></button>')
                                .text('削除')
                                .attr('type', 'button')
                                .addClass('btn-del-mail btn btn-danger pull-left mg-l-5')
                          );
                    $(this).append($lavel);
                });
            }
            EditPanel.addChangeEvent();
        },
        // リアルタイム入力用のイベントの登録
        addChangeEvent: function() {
            $(EditNames.panel.addHash() + ' input, ' + EditNames.panel.addHash() + ' textarea').imeEnter();
        },
        // デイトピッカーのセット
        setDatePicker: function() {
            $(EditNames.phoneOtherDate.addDot()).datepicker({
                format: "yyyy-mm-dd",
                todayBtn: true,
                clearBtn: true,
                language: "ja",
                autoclose: true,
                todayHighlight: true,
                orientation: "top auto",
                beforeShowDay: function (date){
                    date = new UltraDate(date);
                    var holidays = UltraDate.getHolidays(date.getFullYear());
                    var ret = {
                        tooltip: '',
                        classes: ''
                    };
                    var holiday = holidays[date.format(UltraDate.getDefaultFormat())];
                    if (holiday) {
                        ret.tooltip = holiday;
                        ret.classes = 'holiday';
                    }
                    switch (date.getDay()) {
                        case 0:
                            ret.classes += ' sunday';
                            break;
                        case 6:
                            ret.classes += ' saturday';
                            break;
                    }
                    return ret;
                }
            });
        }
    };

    // テーブル操作
    var DataTable = {
        dataBlock: '',
        // タイトル行のテンプレート
        tHeadRowTmp:'<tr>' +
                    '  <th class="col1">部署名</th>' +
                    '  <th class="col2">内容</th>' +
                    '  <th class="col3">電話番号</th>' +
                    '</tr>',
        // 行のテンプレート
        tBodyRowTmp: '<tr>' +
                     '  <th class="col1 col1_1"></th>' +
                     '  <td class="col1 col1_2 hidden"></td>' +
                     '  <td class="col2 "></td>' +
                     '  <td class="col3"></td>' +
                     '</tr>',

        /* ここからコンテキストメニュー用のイベント処理 ---------------------------------------------------------------------------- */
        // 行を上移動
        moveUpRow: function() {
            var $tbody = $($(Names.ctm.addHash()).data(Names.dataTargetElm));
            var $rows = $tbody.find('tr');
            var indexs = DataTable.getSelectRowLength($tbody);
            var $row = $rows.eq(DataTable.getMoveUpRow($tbody, indexs.start));
            var $moveRows = $tbody.find(Names.showMoveRow.addDot());

            for (var i = 0, len = $moveRows.length; i < len; i++) {
                $row.before($moveRows.eq(i));
            }
        },
        // 行を下移動
        moveDownRow: function() {
            var $tbody = $($(Names.ctm.addHash()).data(Names.dataTargetElm));
            var indexs = DataTable.getSelectRowLength($tbody);
            var $rows = $tbody.find('tr');
            var $row = $rows.eq(DataTable.getMoveDownRow($tbody, indexs.end));
            var $moveRows = $tbody.find(Names.showMoveRow.addDot());

            for (var i = $moveRows.length; i >= 0; i--) {
                $row.after($moveRows.eq(i));
            }
        },
        // セルの結合
        joinCell: function() {
            // コンファームで結合するか確認
            if (!confirm('結合元になるセル以外のデータは削除されます。よろしいですか？')) {
                return false;
            }
            // 該当テーブルのtbody
            var $tbody = $($(Names.ctm.addHash()).data(Names.dataTargetElm));
            // 選択しているセル群
            var $selectCells = $tbody.find(Names.uiSelected.addDot()).not('tr');
            // 結合セルの行数
            var rowspan = 0;
            var colName = '';
            // rowspanの数を数える
            $.each(Names.colClasses, function(i, col) {
                $selectCells.filter(col.addDot()).each(function(index, elm) {
                    rowspan += $(elm).getRowspan();
                });
                if (rowspan > 0) {
                    colName = col;
                    // braek
                    return false;
                }
            });
            // 最初のセルにrowspanをセット
            $selectCells.first().attr('rowspan', rowspan)
                                .removeClass(Names.hidden);
            // 次のセルが選択されているかどうか確認
            var col1_2Select = ($selectCells.first().next().hasClass(Names.uiSelected));
            // 次のセルが選択されている=col1クラスのセルで複数列選択されている
            if (col1_2Select) {
                $selectCells.first().next().attr('rowspan', 1)
                                           .addClass(Names.hidden);
            }
            // 見えていないセルも含めて非表示処理とrowspan処理を行う
            var $cell = $selectCells.first().parent().find(colName.addDot()).first();
            for (var i=rowspan; i>1; i--) {
                $cell = $cell.parent().next().find(colName.addDot()).first();
                $cell.attr('rowspan', 1)
                     .addClass(Names.hidden);
                if (col1_2Select) {
                    $cell.next().attr('rowspan', 1)
                                .addClass(Names.hidden);
                }
            }

            // 空白行の削除処理
            DataTable.removeEmptyRow($tbody);

            // colspanのセット
            DataTable.setColspan($tbody);

            var $table = $tbody.parents('table').first();
            $table.find('tfoot').first().find('td').first().attr('colspan', DataTable.getTfootColspan($table));
        },
        // セルの分割
        splitCell: function() {
            // 選択しているセルをループ
            $(Names.uiSelected.addDot()).each(function() {
                // 該当行
                var $row = $(this).parent('tr');
                // rowspanを取得
                var rowspan = $(this).getRowspan();
                // 各列に付与されるクラス
                var colClass = '';
                // 分割するセルがどの列のセルかを確認
                for (var col in Names.colClasses) {
                    if ($(this).hasClass(Names.colClasses[col])) {
                        colClass = Names.colClasses[col];
                        break;
                    }
                }
                // セルのrowspanをクリア
                $(this).attr('rowspan', 1);
                // rowspanの数だけ行にタグを追加
                for (var i = 0; i < (rowspan - 1); i++) {
                    $row = $row.next();
                    $row.children(colClass.addDot()).removeClass(Names.hidden);
                }
             });
        },
        // 1列目の列分割
        splitCol: function() {
            var $tbody = $($(Names.ctm.addHash()).data(Names.dataTargetElm));
            // 選択されたセルをループ
            $tbody.find('th' + Names.uiSelected.addDot()).each(function() {
                // thの次のtd（col1_2）のhiddenクラスを削除
                $(this).next().removeClass(Names.hidden)
                              .addClass(Names.uiSelected)
                              .attr('rowspan', $(this).getRowspan());
            });
            DataTable.setColspan($tbody);
            var $table = $tbody.parents('table').first();
            $table.find('tfoot').first().find('td').first().attr('colspan', DataTable.getTfootColspan($table));
        },
        // 行の追加
        addRow: function(elm) {
            var $tbody = $($(Names.ctm.addHash()).data(Names.dataTargetElm));
            var $rows = $tbody.find('tr');
            var $row;
            // 現在ホバーしている行を取得
            var $hoverRow = $tbody.find('tr' + Names.ctmHover.addDot()).first();
            var rowIndex = $rows.index($hoverRow);
            var $addRow = DataTable.createNewRow();
            // 行のセル確認
            $.each(Names.colClasses, function(i, col) {
                var hoverRowSpan = $hoverRow.find(col.addDot()).getRowspan();
                if (!$hoverRow.find(col.addDot()).isShown()) {
                    // セルの非表示
                    $addRow.find(col.addDot()).addClass(Names.hidden);
                    // rowspanの変更
                    for (var index = rowIndex; index >= 0; index--) {
                        // 前の行のrowspanを確認し、1より大きければその行のrowspanから1引いた値に設定する
                        $row = $rows.eq(index).children(col.addDot()).first();
                        if ($row.getRowspan() > 1) {
                            $row.attr('rowspan', $row.getRowspan() + 1);
                            // これより上にはさかのぼらない
                            break;
                        }
                    }
                } else if (hoverRowSpan > 1) {
                    // セルの非表示
                    $addRow.find(col.addDot()).addClass(Names.hidden);
                    $hoverRow.find(col.addDot()).attr('rowspan', hoverRowSpan + 1);
                }
            });
            // colspanの確認
            if ($($(Names.ctm.addHash()).data(Names.dataTargetElm)).find('.col1_2').isShown()) {
                $addRow.find('.col1_1').first().attr('colspan', 2);
            }
            // 行の追加
            $hoverRow.after($addRow);
            // ドラッグアンドドロップイベントの追加
            Cells.addSortableCol();
        },
        // 行の削除
        delRow: function(elm) {
            if (!confirm('削除すると元に戻せません。よろしいですか？')) {
                return false;
            }

            var $tbody = $($(Names.ctm.addHash()).data(Names.dataTargetElm));
            var $rows = $tbody.find('tr');
            var $row;
            var $cell;
            var $nextCell;
            var $removeRow = $tbody.find('tr' + Names.ctmHover.addDot()).first();
            var rowIndex = $rows.index($removeRow);
            var index = 0;

            $.each(Names.colClasses, function(i, col) {
                // 削除する行のセルを取得
                $cell = $removeRow.children(col.addDot()).first();

                if (!$cell.isShown()) {
                    // セルが表示されていない時（rowspanでまとめられている）
                    for (index = rowIndex; index >= 0; index--) {
                        // 前の行のrowspanを確認し、1より大きければその行のrowspanから1引いた値に設定する
                        $row = $rows.eq(index).children(col.addDot()).first();
                        if ($row.getRowspan() > 1) {
                            $row.attr('rowspan', $row.getRowspan() - 1);
                            // これより上にはさかのぼらない
                            break;
                        }
                    }
                } else if ($cell.getRowspan() > 1) {
                    // rowspanが設定されているときは次の行にコピーしてrowspanを一つ減らす
                    //
                    // 次の行のセルを取得
                    $nextCell = $removeRow.next().children(col.addDot()).first();
                    // 次の行のセルの後ろにクローンしたものを挿入
                    $nextCell.after($cell.clone().attr('rowspan', $cell.getRowspan() -1));
                    // 元の次の行のセルを削除
                    $nextCell.remove();
                }
            });

            $removeRow.fadeOut('slow', function() {
                $removeRow.remove();
            });
        },
        // 2行表示
        show2Col: function() {
            var $table = $($(Names.ctm.addHash()).data(Names.dataTargetElm)).parents('table').first();
            $table.find('.col2').addClass(Names.hidden);
            DataTable.removeEmptyRow($table.find('tbody').first());
            $table.find('tfoot').first().find('td').first().attr('colspan', DataTable.getTfootColspan($table));
        },
        // 3行表示
        show3Col: function() {
            var $table = $($(Names.ctm.addHash()).data(Names.dataTargetElm)).parents('table').first();
            var rowspaning = 1;
            $table.find('.col2').each(function() {
                // rowspanが1より大きい時はrowspaningに値をセットする
                if ($(this).getRowspan() > 1) {
                    rowspaning = $(this).getRowspan();
                    $(this).removeClass(Names.hidden);
                }
                rowspaning -= 1;
                // rowspaningが1より小さい時は非表示のまま、そうで無い時はhiddenクラスを削除
                if (rowspaning < 1) {
                    $(this).removeClass(Names.hidden);
                }
            });
            $table.find('tfoot').first().find('td').first().attr('colspan', DataTable.getTfootColspan($table));
        },
        // フッター行の追加
        addTfoot: function() {
            var $table = $($(Names.ctm.addHash()).data(Names.dataTargetElm)).parents('table').first();
            var $td = $('<td></td>').attr('colspan', DataTable.getTfootColspan($table));
            var $tfoot = $('<tfoot></tfoot>').append(
                $('<tr></tr>').append($td)
            );
            $table.append($tfoot);
        },
        // フッター行の削除
        removeTfoot: function() {
            var $table = $($(Names.ctm.addHash()).data(Names.dataTargetElm)).parents('table').first();
            $table.find('tfoot').remove();
        },
        /* ここまでコンテキストメニュー用のイベント処理 ---------------------------------------------------------------------------- */
        // 選択が始まっているときにどのクラスを含んでいたかの確認用
        selectStart: '',
        // セルの選択（jQueryUIのselectable）
        addSelectEvent: function() {
            $('tbody').selectable({
                filter: 'th, td',
                // 選択開始時のイベント
                start: function() {
                    $(Names.uiSelected.addDot()).removeClass(Names.uiSelected);
                },
                // 選択完了時のイベント
                stop: function(e, ui) {
                    // 選択完了時に値のクリア
                    DataTable.selectStart = '';
                },
                // 選択中のイベント
                selecting: function(e, ui) {
                    // 最初に選択を始めた列のクラスを設定
                    if (!DataTable.selectStart) {
                        switch (true) {
                            case $(ui.selecting).hasClass('col1'):
                                DataTable.selectStart = 'col1';
                                break;
                            case $(ui.selecting).hasClass('col2'):
                                DataTable.selectStart = 'col2';
                                break;
                            case $(ui.selecting).hasClass('col3'):
                                DataTable.selectStart = 'col3';
                                break;
                        }
                    }
                    // 同じ列のもの以外は選択できないようにする
                    if (!$(ui.selecting).hasClass(DataTable.selectStart)) {
                        $(ui.selecting).removeClass(Names.uiSelecting);
                    }
                },
                // 選択が終わって選択中から選択済みに変わる時のイベント
                selected: function(e, ui) {
                    if (!$(ui.selected).hasClass(DataTable.selectStart)) {
                        $(ui.selected).removeClass(Names.uiSelected);
                    }
                    $(Names.hover.addDot()).removeClass(Names.hover);
                    $(ui.selected).parents('tr').first().addClass(Names.hover);
                }
            });
        },
        // 1列目のcolspanをセット・リセット
        setColspan: function($tbody) {
            // col1_2クラスのある場合はcolspanをセット
            if ($tbody.find('.col1_2').isShown()) {
                $tbody.prev('thead').find('th').first().attr('colspan', 2);
                var rowspaning = 0;
                $tbody.find('.col1_1').each(function() {
                    if ($(this).next().getRowspan() > 1) {
                        rowspaning = $(this).next().getRowspan();
                    }
                    if ($(this).next().isShown()) {
                        $(this).attr('colspan', 1);
                    } else if (rowspaning > 0) {
                        $(this).attr('colspan', 1);
                    } else {
                        $(this).attr('colspan', 2);
                    }
                    rowspaning -= 1;
                });
            } else {
                $tbody.prev('thead').find('th').first().attr('colspan', 1);
                $tbody.find('.col1_1').attr('colspan', 1);
            }
        },
        // 空行の削除
        removeEmptyRow: function($tbody) {
            var $rows = $tbody.find('tr');
            // 空白の行の削除処理
            $rows.each(function() {
                if (!$(this).isEmptyRow()) {
                    // continu
                    return true;
                }

                var rowIndex = $rows.index(this);
                rowspan = 0;
                $.each(Names.colClasses, function(i, colName) {
                    // セルが表示されていない時（rowspanでまとめられている）
                    for (var index = rowIndex; index >= 0; index--) {
                        // 前の行のrowspanを確認し、1より大きければその行のrowspanから1引いた値に設定する
                        $prevCell = $rows.eq(index).children(colName.addDot()).first();
                        rowspan = $prevCell.getRowspan();
                        if (rowspan > 1) {
                            $prevCell.attr('rowspan', rowspan - 1);
                            // これより上にはさかのぼらない
                            break;
                        }
                    }
                });

                // 行を削除する
                $(this).remove();
            });
        },
        // 行をホバーした時
        hoverRow: function(elm) {
            // 行を見やすいように行の上下を線で挟む
            $(elm).parents(Names.tblWrap).first()
                   .append($(Names.hoverRowTop.addHash()))
                   .append($(Names.hoverRowBottom.addHash()));
            $(Names.hoverRowTop.addHash()).css({
                top: $(elm).offset().top - 1,
                left: $(elm).offset().left,
                width: $(elm).width() + 'px'
            }).show();
            $(Names.hoverRowBottom.addHash()).css({
                top: $(elm).offset().top + $(elm).height() -1,
                left: $(elm).offset().left,
                width: $(elm).width() + 'px'
            }).show();
        },
        // コンテキストメニューの「行の追加」をホバーした時に挿入場所の線を表示
        hoverUpRow: function() {
            var $tbody = $($(Names.ctm.addHash()).data(Names.dataTargetElm));
            var $rows = $tbody.find('tr');

            var indexs = DataTable.getSelectRowLength($tbody);
            // indexsの最初から最後の行まで選択クラスを付与する
            for (var i = indexs.start, len = indexs.end; i <= len; i++) {
                $rows.eq(i).addClass(Names.showMoveRow);
            }
            // 上の移動先の行を取得する
            var $row = $rows.eq(DataTable.getMoveUpRow($tbody, indexs.start));

            // セパレータを挿入して表示
            $tbody.parents(Names.tblWrap).first().append($(Names.rowSeparator.addHash()));
            $(Names.rowSeparator.addHash()).css({
                top: $row.offset().top,
                left: $row.offset().left,
                background: '#744199',
                width: $tbody.width() + 'px'
            }).show();
        },
        // コンテキストメニューの「行の追加」をホバーした時に挿入場所の線を表示
        hoverDownRow: function() {
            var $tbody = $($(Names.ctm.addHash()).data(Names.dataTargetElm));
            var $rows = $tbody.find('tr');

            // 現在選択されている行から移動するブロックを取得する
            var indexs = DataTable.getSelectRowLength($tbody);
            // indexsの最初から最後の行まで選択クラスを付与する
            for (var i = indexs.start, len = indexs.end; i <= len; i++) {
                $rows.eq(i).addClass(Names.showMoveRow);
            }
            // 下の移動先の行を取得する
            var $row = $rows.eq(DataTable.getMoveDownRow($tbody, indexs.end));

            // セパレータを挿入して表示
            $tbody.parents(Names.tblWrap).first().append($(Names.rowSeparator.addHash()));
            $(Names.rowSeparator.addHash()).css({
                top: $row.offset().top + $row.height(),
                left: $row.offset().left,
                background: '#744199',
                width: $tbody.width() + 'px'
            }).show();
        },
        // コンテキストメニューの「行の追加」をホバーした時に挿入場所の線を表示
        hoverAddRow: function() {
            var $tbody = $($(Names.ctm.addHash()).data(Names.dataTargetElm));
            var $row = $tbody.find('tr' + Names.ctmHover.addDot()).first();
            $tbody.parents(Names.tblWrap).first().append($(Names.rowSeparator.addHash()));
            $(Names.rowSeparator.addHash()).css({
                top: $row.offset().top + $row.height(),
                left: $row.offset().left,
                background: '#f00',
                width: $tbody.width() + 'px'
            }).show();
        },
        // コンテキストメニューの「行の削除」をホバーした時に削除行の実際に削除されるセルに削除クラスを付与
        hoverDelRow: function() {
            // 行を見やすいように行の上にパネルを表示
            var $tbody = $($(Names.ctm.addHash()).data(Names.dataTargetElm));
            var $row = $tbody.find('tr' + Names.ctmHover.addDot()).first();
            $row.children().each(function() {
                if (!$(this).isShown() || $(this).getRowspan() === 1) {
                    $(this).addClass(Names.showDelRow);
                }
            });
            // コンテンツの追加ボタンの退避
            Cells.removeAddBoxBtn();
        },
        // 移動する行の範囲を取得
        getSelectRowLength: function($tbody) {
            var $rows = $tbody.find('tr');
            var ret = {
                start: 0,
                end: -1
            };
            var $selectRow = $tbody.find('tr' + Names.ctmHover.addDot()).first();
            var selectIndex = $rows.index($selectRow);
            var i = 0;
            var len = 0;
            // 検索をかける列の取得
            var cols = DataTable.getColClass($tbody);
            // 列が全て表示されているかどうかの判定用関数
            var isAllShow = function($row){
                var ret = true;
                $.each(cols, function(i, col) {
                    if (!$row.find(col.addDot()).isShown()) {
                        ret = false;
                        return false;
                    }
                });
                return ret;
            };
            // 全ての行が表示されているところまでさかのぼる
            for (i = selectIndex; i >= 0; i--) {
                if (isAllShow($rows.eq(i))) {
                    // すべての列が表示されているところをスタートインデックスとする
                    ret.start = i;
                    break;
                }
            }

            // 次の全ての行が表示されている前の行を終わりの行とする
            for (i = ret.start + 1, len = $rows.length; i < len; i++) {
                if (isAllShow($rows.eq(i))) {
                    // すべての列が表示されているところを最終
                    ret.end = i - 1;
                    break;
                }
            }
            if (ret.end === -1) {
                ret.end = $rows.length - 1;
            }
            return ret;
        },
        // 上の行に移動するときの移動先の行
        getMoveUpRow: function($tbody, index) {
            var $rows = $tbody.find('tr');
            var rowIndex = index - 1;

            // 検索をかける列の取得
            var cols = DataTable.getColClass($tbody);
            // 列が全て表示されているかどうかの判定用関数
            var isAllShow = function($row){
                var ret = true;
                $.each(cols, function(i, col) {
                    if (!$row.find(col.addDot()).isShown()) {
                        ret = false;
                        return false;
                    }
                });
                return ret;
            };
            // 全ての行が表示されているところまでさかのぼる
            for (var i = rowIndex; i >= 0; i--) {
                if (isAllShow($rows.eq(i))) {
                    // すべての列が表示されているところをスタートインデックスとする
                    rowIndex = i;
                    break;
                }
            }

            return rowIndex;
        },
        // 下の行に移動するときの移動先の行
        getMoveDownRow: function($tbody, index) {
            var $rows = $tbody.find('tr');
            var rowIndex = index + 1;

            // 検索をかける列の取得
            var cols = DataTable.getColClass($tbody);
            var rowspans = {};
            $.each(cols, function(i, col) {
                rowspans[col] = 0;
            });
            // 各カラムのrowspanを個別に計算し、すべてのrowspanが一致するかどうかの確認
            var matchRowspanNums = function($row){
                var ret = true;
                // rowspanの数を計算する
                $.each(cols, function(i, col) {
                    if ($row.find(col.addDot()).isShown()) {
                        rowspans[col] += $row.find(col.addDot()).getRowspan();
                    }
                });
                loop: for (var keys in rowspans) {
                    for (var key in rowspans) {
                        if (rowspans[keys] !== rowspans[key]) {
                            ret = false;
                            break loop;
                        }
                    }
                }
                return ret;
            };
            // 全ての列のrowspanがマッチするまでループ
            for (var i = rowIndex, len = $rows.length; i < len; i++) {
                if (matchRowspanNums($rows.eq(i))) {
                    rowIndex = i;
                    break;
                }
            }

            return rowIndex;
        },
        // 表示されている列のクラス群を取得
        getColClass: function($tbody) {
            var $theadRow = $tbody.parents('table').first()
                                  .find('thead').first()
                                  .find('tr').first();
            // 検索をかける列の取得
            var cols = [];
                cols.push('col1_1');
            if ($theadRow.find('.col1').getColspan() > 1) {
                cols.push('col1_2');
            }
            if ($theadRow.find('.col2').isShown()) {
                cols.push('col2');
            }
            cols.push('col3');

            return cols;
        },
        // tfoot用のcolspanを取得
        getTfootColspan: function($table) {
            var colspan = 0;
            $table.find('thead').first().find('th').each(function() {
                if ($(this).isShown()) {
                    colspan += $(this).getColspan();
                }
            });
            return colspan;
        },
        createNewRow: function() {
            var $newRow = $(DataTable.tBodyRowTmp);
            $newRow.children().each(function() {
                var $boxTmp = $(Cells.boxTmp);
                $boxTmp.find(BoxNames.wrapPhone.addDot()).first().append($(Cells.phoneTmp));
                $boxTmp.find(BoxNames.wrapMail.addDot()).first().append($(Cells.mailTmp));
                $(this).append($boxTmp);
            });
            return $newRow;
        }
    };

    // コンテキストメニュー
    var Context = {
        // コンテキストメニューの表示
        show: function(tbody, e) {
            var $tbody = $(tbody);
            // ホバークラスのついたものにコンテキストメニュー用のホバーを付ける
            // ホバー行を固定する為
            $tbody.find(Names.hover.addDot()).addClass(Names.ctmHover);
            // ホバー中のセル（行以外）を取得
            var $cmtHoverCells = $tbody.find(Names.ctmHover.addDot()).filter('th, td');
            var $cmtHoverRow = $tbody.find(Names.ctmHover.addDot()).filter('tr');
            // ホバークラスに選択クラスが無い場合はホバーしているセルを選択中セルにする
            $cmtHoverCells.each(function(i, cell) {
                if (!$(this).hasClass(Names.uiSelected)) {
                    $tbody.find(Names.uiSelected.addDot())
                          .removeClass(Names.uiSelected);
                    $(this).addClass(Names.uiSelected);
                }
            });
            // コンテキストに該当tbodyをセット
            $(Names.ctm.addHash()).data(Names.dataTargetElm, tbody);

            /* ここから各メニューの表示・非表示 ---------------------------------------- */
            var $trs = $tbody.find('tr');
            var indexs = DataTable.getSelectRowLength($tbody);
            // ▲行を上に移動 ------------------------------------------------------
            $(Names.ctmMoveUp.addHash()).removeClass(Names.disabled);
            if (indexs.start === 0) {
                $(Names.ctmMoveUp.addHash()).addClass(Names.disabled);
            }

            // ▼行を下に移動 ------------------------------------------------------
            $(Names.ctmMoveDown.addHash()).removeClass(Names.disabled);
            if (indexs.end === ($trs.length - 1)) {
                $(Names.ctmMoveDown.addHash()).addClass(Names.disabled);
            }

            // セルの結合 ---------------------------------------------------------
            if ($trs.find(Names.uiSelected.addDot()).length > 1) {
                $(Names.ctmJoinCell.addHash()).removeClass(Names.disabled);
            } else {
                $(Names.ctmJoinCell.addHash()).addClass(Names.disabled);
            }
            // col1_1とcol1_2の最初と最後の行がそろっていない場合はセルの結合設定を無効にする
            var $selected = $(Names.uiSelected.addDot());
            if ($selected.filter('.col1_1').length > 0 &&
                    $selected.filter('.col1_2').length > 0) {
                var col1_1_start = $selected.filter('.col1_1').first().parent().index();
                var col1_2_start = $selected.filter('.col1_2').first().parent().index();
                if (col1_1_start !== col1_2_start) {
                    $(Names.ctmJoinCell.addHash()).addClass(Names.disabled);
                }
                var col1_1_end = $selected.filter('.col1_1').last().parent().index() +
                                    $selected.filter('.col1_1').last().getRowspan();
                var col1_2_end = $selected.filter('.col1_2').last().parent().index() +
                                    $selected.filter('.col1_2').last().getRowspan();
                if (col1_1_end !== col1_2_end) {
                    $(Names.ctmJoinCell.addHash()).addClass(Names.disabled);
                }
            }

            // セルの分割 ---------------------------------------------------------
            $(Names.ctmSplitCell.addHash()).addClass(Names.disabled);
            $tbody.find(Names.ctmHover.addDot() + ' ' + Names.uiSelected.addDot()).each(function () {
                var rspan = $(this).getRowspan();
                if ($(this).getRowspan() > 1) {
                    $(Names.ctmSplitCell.addHash()).removeClass(Names.disabled);
                    return false;
                }
            });

            // セルの列分割 -------------------------------------------------------
            $(Names.ctmSplitCol.addHash()).addClass(Names.disabled);
            $tbody.find('th' + Names.uiSelected.addDot()).each(function() {
                if ($(this).next().hasClass(Names.hidden)) {
                    $(Names.ctmSplitCol.addHash()).removeClass(Names.disabled);
                    return false;
                }
            });

            // 行の追加 ----------------------------------------------------------
            var colBool = true;
            $.each(Names.colClasses, function(i, col) {
                var $cell = $cmtHoverRow.children(col.addDot());
                colBool = ($cell.isShown() && $cell.getRowspan() === 1) ? false : true;
            });
            if (colBool) {
                $(Names.ctmAddRow.addHash()).addClass(Names.disabled);
            } else {
                $(Names.ctmAddRow.addHash()).removeClass(Names.disabled);
            }

            // 行の削除 ----------------------------------------------------------
            if ($trs.length > 1) {
                $(Names.ctmDelRow.addHash()).removeClass(Names.disabled);
            } else {
                $(Names.ctmDelRow.addHash()).addClass(Names.disabled);
            }

            // 2列・3列表示 ------------------------------------------------------
            if ($tbody.find('.col2').isShown()) {
                $(Names.ctmTitle2Col.addHash()).removeClass(Names.disabled);
                $(Names.ctmTitle3Col.addHash()).addClass(Names.disabled);
            } else {
                $(Names.ctmTitle2Col.addHash()).addClass(Names.disabled);
                $(Names.ctmTitle3Col.addHash()).removeClass(Names.disabled);
            }

            // フッター行の追加・削除 ------------------------------------------------
            if ($tbody.next('tfoot').length > 0) {
                $(Names.ctmDelTfoot.addHash()).removeClass(Names.disabled);
                $(Names.ctmAddTfoot.addHash()).addClass(Names.disabled);
            } else {
                $(Names.ctmAddTfoot.addHash()).removeClass(Names.disabled);
                $(Names.ctmDelTfoot.addHash()).addClass(Names.disabled);
            }

            /* ここまで各メニューの表示・非表示 ---------------------------------------- */

            // コンテキストメニューを表示
            $(Names.ctm.addHash()).fadeIn('fast');
            var pageY = e.pageY - $(window).scrollTop();
            var pageX = e.pageX - $(window).scrollLeft();
            // パディング、ボーダーを含めた高さを取得
            var ulBottom = $(Names.ctm.addHash()).find('ul').outerHeight();
            // パディング、ボーダーを含めた幅を取得
            var ulLeft = $(Names.ctm.addHash()).find('ul').outerWidth();
            // 画面から高さがはみ出る場合は位置を調整
            if ($(window).height() < pageY + ulBottom) {
                pageY -= ulBottom;
            }
            // 画面から幅がはみ出る場合は位置を調整
            if ($(window).width() < pageX + ulLeft) {
                pageX -= ulLeft;
            }
            $(Names.ctm.addHash()).children('ul')
                               .css({
                                    top: pageY,
                                    left: pageX
                                });
        },
        // コンテキストメニューの非表示
        hide: function(elm) {
            $(elm).fadeOut('fast', function () {
                $($(Names.ctm.addHash()).data(Names.dataTargetElm))
                                      .find(Names.ctmHover.addDot())
                                      .removeClass(Names.ctmHover)
                                      .addClass(Names.hover);
            });
        }
    };

    // 「カテゴリの編集」モーダル用
    var ModalCate = {
        // カテゴリ行のテンプレート
        row: '<tr>' +
             '    <td class="' + Names.mdlCateSort + '">⇕</td>' +
             '    <td><input type="text" class="' + Names.mdlCateName + '"></td>' +
             '    <td><input type="text" class="' + Names.mdlCateId + '"></td>' +
             '    <td><input type="text" class="' + Names.mdlCateClass + '"></td>' +
             '    <td>' +
             '        <select class="' + Names.mdlCateEnable + '">' +
             '            <option value="0">-</option>' +
             '            <option value="1">削除</option>' +
             '        </select>' +
             '    </td>' +
             '</tr>',
        // 表に追加するときのテンプレート
        sectionTmp: '<div class="tn-section" id="">' +
                    '  <h3>総合</h3>' +
                    '  <div class="' + Names.tblWrap + '">' +
                    '    <table>' +
                    '      <thead>' +
                    '      </thead>' +
                    '      <tbody>' +
                    '      </tbody>' +
                    '    </table>' +
                    '  </div>' +
                    '</div>',
        // モーダルの表示
        show: function(table) {
            // 一旦行の全削除
            $(Names.mdlCateTable.addHash()).empty();
            $(Names.cntBody.addDot()).first().find(Names.section.addDot()).each(function() {
                ModalCate.addRow(
                    $(this).children('h3').text(),
                    $(this).attr('id'),
                    $(this).attr('class')
                );
            });
        },
        // カテゴリの「表示・削除」の値が変わった時の処理
        changeCateEnable: function(elm) {
            // カテゴリを削除するかどうかの値を確認してクラスを設定する
            if ($(elm).children('option:selected').first().val() === '0') {
                $(elm).removeClass(Names.mdlCateDel);
            } else {
                $(elm).addClass(Names.mdlCateDel);
            }
        },
        // 行の追加処理
        addRow: function(cateName, cateId, cateClass) {
            // カテゴリ一覧のテーブルを選択
            var $cateTable = $(Names.mdlCateTable.addHash());
            // 追加する行のテンプレートをｊQueryオブジェクトとして取得
            var $row = $(ModalCate.row);
            // 行のinput要素に値を設定
            $row.find(Names.mdlCateName.addDot()).first().val(cateName || '');
            $row.find(Names.mdlCateId.addDot()).first().val(cateId ? cateId.split('-')[1] : '')
                                         .attr(Names.mdlCateNowId,  cateId || '');
            // sectionタグの代わりに付けているtn-sectionを削除
            cateClass = cateClass || '';
            cateClass = cateClass.replace(Names.section, '').trim();
            $row.find(Names.mdlCateClass.addDot()).first().val(cateClass || '');
            // 新規行の時は必須エラーを付与
            if (!cateName) {
                $row.find(Names.mdlCateName.addDot())
                    .addClass(Names.mdlCateErrInput)
                    .after($('<div></div>')
                    .text('※必須項目です')
                    .addClass(Names.mdlCateErrPnl));
            }
            if (!cateId) {
                $row.find(Names.mdlCateId.addDot())
                    .addClass(Names.mdlCateErrInput)
                    .after($('<div></div>')
                    .text('※必須項目です')
                    .addClass(Names.mdlCateErrPnl));
            }
            // テーブルの最後に追加
            $cateTable.append($row);
            // 追加した行の名前にフォーカスを移動
            $cateTable.find(Names.mdlCateName.addDot()).last().focus();
        },
        // 名前の確認
        validateName: function(elm) {
            // 空文字の確認
            if (ModalCate.validateEmpty(elm)) {
                return;
            }
            // 重複チェック
            ModalCate.validateOverlap(Names.mdlCateName);
        },
        // idの確認
        validateId: function(elm) {
            // 空文字の確認
            if (ModalCate.validateEmpty(elm)) {
                return;
            }
            // 入力文字種のチェック
            if ($(elm).val().match(/[^a-zA-Z0-9_-]+/)) {
                $(elm).addClass(Names.mdlCateErrInput)
                      .after($('<div></div>')
                      .text('※使用できる文字は英数字とハイフン、アンダースコアのみです')
                      .addClass(Names.mdlCateErrPnl));
                return;
            } else if ($(elm).val().match(/^[0-9_-]+/)) {
                $(elm).addClass(Names.mdlCateErrInput)
                      .after($('<div></div>')
                      .text('※数字・記号から始まるものは設定できません')
                      .addClass(Names.mdlCateErrPnl));
            } else {
                $(elm).removeClass(Names.mdlCateErrInput)
                      .next(Names.mdlCateErrPnl.addDot()).remove();
            }
            // 重複チェック
            ModalCate.validateOverlap(Names.mdlCateId);
        },
        // idの確認
        validateClass: function(elm) {
            $(elm).removeClass(Names.mdlCateErrInput)
                  .parents('td').first().find(Names.mdlCateErrPnl.addDot()).remove();
            if ($(elm).val().match(/^[0-9_-]+/)) {
                $(elm).addClass(Names.mdlCateErrInput)
                      .after($('<div></div>')
                      .text('※数字・記号から始まるものは設定できません')
                      .addClass(Names.mdlCateErrPnl));
            }
        },
        // 空白かどうかの確認
        validateEmpty: function(elm) {
            $(elm).removeClass(Names.mdlCateErrInput)
                  .parents('td').first().find(Names.mdlCateErrPnl.addDot()).remove();
            if ($(elm).val()) {
                return false;
            } else {
                $(elm).addClass(Names.mdlCateErrInput)
                      .after($('<div></div>')
                      .text('※必須項目です')
                      .addClass(Names.mdlCateErrPnl));
                return true;
            }
        },
        // 重複チェック
        validateOverlap: function(col) {
            var vals = [];
            var overlaps = [];
            var i, len;
            // 重複エラーを一旦初期化
            $(Names.mdlCateTable.addHash()).find(col.addDot()).each(function() {
                $(this).removeClass(Names.mdlCateErrOverlap);
                $(this).parents('td').first().find(Names.mdlCateErrOverlap.addDot()).remove();
                if ($(this).parents('td').first().find(Names.mdlCateErrInput.addDot()).length === 0) {
                    $(this).removeClass(Names.mdlCateErrInput);
                }
            });

            // 列の値を配列に保存
            $(Names.mdlCateTable.addHash()).find(col.addDot()).each(function() {
                if ($.inArray($(this).val(), vals) === -1) {
                    vals.push($(this).val());
                } else {
                    if ($.inArray($(this).val(), overlaps) === -1 && $(this).val() !== '') {
                        overlaps.push($(this).val());
                    }
                }
            });
            for (i = 0, len = overlaps.length; i < len; i++) {
                $(Names.mdlCateTable.addHash()).find(col.addDot()).each(function() {
                    if ($(this).val() === overlaps[i]) {
                        $(this).addClass(Names.mdlCateErrInput)
                               .addClass(Names.mdlCateErrOverlap)
                               .after(
                                    $('<div></div>').text('※値が重複しています')
                                                    .addClass(Names.mdlCateErrPnl)
                                                    .addClass(Names.mdlCateErrOverlap)
                                );
                    }
                });
            }
        },
        // ページ内リンクの作成
        createUl: function(pageName) {
            var $ul = $('<ul></ul>').attr('id', 'inpage-links');
            $(Names.cntBody.addDot()).first().find(Names.section.addDot()).each(function() {
                var href = $(this).attr('id');
                $ul.append(
                    $('<li></li>').append(
                        $('<a></a>').attr('href', href)
                                    .text($(this).children('h3').text())
                    )
                );
            });
            return $ul;
        },
        // カテゴリの表への反映
        reflect: function() {
            // エラーの存在する場合は何もしない
            if ($(Names.mdlCateTable.addHash()).find(Names.mdlCateErrInput.addDot()).length > 0) {
                alert('エラーを修正してください');
                return false;
            }
            var hasDel = false;
            var delElm = $(Names.mdlCateTable.addHash()).find('option:selected').each(function() {
                if ($(this).attr('value') === '1') {
                    hasDel = true;
                    return true;
                }
            });

            if (hasDel) {
                if (!confirm("削除項目があります。\n更新してもよろしいですか？")) {
                    return false;
                }
            }

            // ページ内リンク
            var $ul = $('<ul></ul>').attr('id', 'inpage-links');

            // パネルの入れ替え
            var newArr = [];
            $(Names.mdlCateTable.addHash()).children('tr').each(function() {
                if ($(this).find(Names.mdlCateEnable.addDot()).first().val() === '1') {
                    return true;
                }
                var nowval = $(this).find(Names.mdlCateId.addDot()).first().attr(Names.mdlCateNowId);
                var $obj;
                if (nowval) {
                    $obj = $(nowval.addHash()).clone();
                } else {
                    $obj = $(ModalCate.sectionTmp);
                    $obj.find('thead').first().append($(DataTable.tHeadRowTmp));
                    $obj.find('tbody').first().append(DataTable.createNewRow());
                }
                var id = Names.mdlCateIdPre + $(this).find(Names.mdlCateId.addDot()).first().val();
                var name = $(this).find(Names.mdlCateName.addDot()).first().val();
                $obj.attr(Names.mdlCateNowId, Names.mdlCateIdPre + $(this).find(Names.mdlCateId.addDot()).first().val())
                    .attr('id', id)
                    // addClassにしないのは現在のものとの置き換えを目的としている為
                    .attr('class', $(this).find(Names.mdlCateClass.addDot()).first().val())
                    .addClass(Names.section)
                    .children('h3').text(name);
                newArr.push($obj);

                $ul.append(
                    $('<li></li>').append(
                        $('<a></a>').attr('href', '#' + id)
                                    .text(name)
                    )
                );
            });

            // 一旦データを空にする
            $(Names.cntBodyDataWrap.addHash()).empty();
            // ナビゲーションの挿入
            $(Names.cntBodyDataWrap.addHash()).first().append($ul);
            // 新規に挿入
            $.each(newArr, function(i, val) {
                $(Names.cntBodyDataWrap.addHash()).append(val);
            });
            // 編集フラグをセット
            isEdit = true;
            // テーブル選択の有効化
            DataTable.addSelectEvent();
            // コンテンツボックスのドラッグアンドドロップ有効化
            Cells.addSortableCol();
            $(Names.mdlCate.addHash()).modal('hide');
        }
    };

    // 「問合せ一覧」モーダル用
    var ModalMenu = {
        // 表示処理
        show: function() {
            // モーダル表示時に選択したリストのクリア、ボタンの無効化を行う
            ModalMenu.removeSelect();
            $(Names.mdlMenuBtnShow.addHash()).addClass(Names.disabled);
        },
        // リストを選択した時の処理
        liSelect: function(elm) {
            // リストをクリックした際に選択クラスの付与とボタンの有効化を行う
            ModalMenu.removeSelect();
            $(elm).addClass(Names.selected);
            $(Names.mdlMenuBtnShow.addHash()).removeClass(Names.disabled);
        },
        // 選択されているリストのクリア
        removeSelect: function() {
            // 選択されているリストをクリアする
            $(Names.mdlMenu.addHash()).find('li').removeClass(Names.selected);
        },
        // 選択されているページの取得
        getPage: function(elm) {
            var $modalMenu = $(Names.mdlMenu.addHash());
            if (isEdit) {
                if (!confirm("現在表示中のページは編集されているようです。\n編集を保存せずにページを取得しますか？")) {
                    $modalMenu.modal('hide');
                    return;
                }
            }
            // 選択されているリストのページを取得して表示する
            // var $menuSelect = $modalMenu.find('li' + Names.selected.addDot()).first();
            var $menuSelect = $(elm);
            var url = 'html/get/' + $menuSelect.attr(Names.dataMenuName);
            $modalMenu.modal('hide');
            Ajaxs.get(url);
        }
    };


    // 本番用のJSと合わせること！
    // BoxNamesオブジェクトも忘れずに！
    var phoneOther = {
        // ○○○○年○○月○○日[から・まで]を表示するようのテンプレート
        tmp: '<div class="until-phone">' +
             '  <span class="' + BoxNames.phoneOtherDateClass + '"></span>' +
             '  <span>:</span>' +
             '  <span class="' + BoxNames.phoneOtherNumberClass + '"></span>' +
             '</div>',
        set: function() {
            // 更新システム用
            // $(EditNames.panel.addHash() + '-preview').find('['+ BoxNames.phoneOtherDate +']')
            //
            // 本番用
            // $('['+ BoxNames.phoneOtherDate +']')
            $(EditNames.panel.addHash() + '-preview').find('['+ BoxNames.phoneOtherDate +']').each(function() {
                var date = $(this).attr(BoxNames.phoneOtherDate) || '1900-01-01';
                var phoneState = $(this).attr(BoxNames.phoneOtherState);
                var stateStr = phoneState === '1' ? 'から' : 'まで';
                var otherNum = $(this).attr(BoxNames.phoneOtherNumber);
                var defaultNum = $(this).attr(BoxNames.phoneDefaultNumber);
                var $boxPhoneNum = $(this).find(BoxNames.phoneNumber.addDot()).first();
                $boxPhoneNum.empty();
                $boxPhoneNum.append($('<em></em>').text(defaultNum));

                if (phoneOther.validDate(date) && otherNum) {
                    var checkDate = new Date(date);
                    var today = new Date();

                    if (phoneState === '1') {
                        if (today >= checkDate) {
                            $boxPhoneNum.empty();
                            $boxPhoneNum.append($('<em></em>').text(otherNum));
                        } else {
                            phoneOther.setAfter(this, otherNum, stateStr, checkDate);
                        }
                    } else if (phoneState === '2') {
                        if (today <= checkDate) {
                            phoneOther.setAfter(this, otherNum, stateStr, checkDate);
                        }
                    }
                }
            });
        },
        setAfter: function(elm, phoneNumber, stateStr, checkDate) {
            var $div = $(phoneOther.tmp);
            var viewDate = checkDate.getFullYear() + '年' +
                           (checkDate.getMonth() + 1) + '月' +
                           checkDate.getDate() + '日' +
                           stateStr;
            $div.find(BoxNames.phoneOtherDateClass.addDot()).first().text(viewDate);
            $div.find(BoxNames.phoneOtherNumberClass.addDot()).first().text(phoneNumber);
            $(elm).append($div);
        },
        validDate: function(date) {
            var dateArr = date.split('-');
            var y = parseInt(dateArr[0], 10) || 0;
            var m = parseInt(dateArr[1], 10) || 0;
            var d = parseInt(dateArr[2], 10) || 0;
            var dt = new Date(y, m - 1, d);
            return (dt.getFullYear() === y, dt.getMonth() === m, dt.getDate() === d);
        }
    };

    // 初期化の実行
    Init();
});
