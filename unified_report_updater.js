$(function(){

//全体設定
	// モーダル設定
    $(document).on('hidden.bs.modal', '.modal', function(){
        $(this).removeData('bs.modal');
    });

    $( '.jquery-ui-sortable' ).sortable({
    /*placeholder: 'sort-placeholder',*/
     forcePlaceholderSize: true,
     items: '> tr:not(.unsortable)',
     cursor: 'move', opacity: 0.2,
     update: function(e, ui) {
    window.alert($('.jquery-ui-sortable').sortable('toArray'));
    }
      });

	var cookie_name_sortable = "sortable";
	var sortable_class = ".jquery-ui-sortable";

	$(sortable_class).sortable();
	$(sortable_class).sortable({
		update: function(ev, ui) {
			var sorted =  $(sortable_class).sortable("toArray").join(",");
			$.cookie(cookie_name_sortable, sorted, {expires: 30});
		}
	});

	if($.cookie(cookie_name_sortable)) {
		var sorted = $.cookie(cookie_name_sortable).split(",").reverse();
		$.each(
			sorted,
			function(index, value) {$('#'+value).prependTo(sortable_class);}
		);
	}

	$('.datepicker').datepicker({
  		language: 'ja',
  		format: 'yyyy-mm-dd'
		});

	// トップページ全体設定

		 $("#fileup1").on('change', function() {

        if(!confirm("アップロードしますか？")) {
                return false;

            } else {

        // 要素を取得

        var formData = new FormData();
        formData.append("uploadFile", $('#fileup1')[0].files[0]);

        $.ajax({
            url: $($('.form_up1')).attr('action'),
            type:'POST',
            enctype  : 'multipart/form-data',
            processData: false,
            contentType: false,
            dataType: 'json',
            // サーバに送信するデータ
            data : formData
        }).then(
          function(data) {
            $('#topledgerFile1').val(data.filename);
            $('#topfileSize1').val(data.filesize);
          },
          function(XMLHttpRequest, textStatus, errorThrown) {
            alert('ファイルのアップロードに失敗しました。');
          }
        );

      }
      });

// ajax通信設定
  $('#fileup_btn1').on('click', function() {

            if(!confirm("更新しますか？")) {
              return false;

            }else{
            var hostUrl= './topledger/topedit';
            var formData = new FormData($('#fileRecord1')[0]);


             // formDataに必要な要素を登録
            formData.append("id", $('#fileRecord1').find('input[name=id]').val());
            formData.append("fileName", $('#fileRecord1').find('input[name=fileName]').val());
            formData.append("fileSize", $('#fileRecord1').find('input[name=fileSize]').val());

            $.ajax({
                url: hostUrl,
                type:'POST',
                enctype  : 'multipart/form-data',
                processData: false,
                contentType: false,
                dataType: 'json',
                // サーバに送信するデータ
                data : formData
                }).then(
                function(formData) {
					window.location.reload();
                },
                function(XMLHttpRequest, textStatus, errorThrown) {
                             alert("更新に失敗しました");
                       });
              }
        });

  $('#fileup_center').on('change', function() {

    if (!confirm("アップロード更新しますか？")) {
      return false;
    }

    // 送信データ
    var formData = new FormData();
    formData.append("uploadFile", $('#fileup_center')[0].files[0]);
    formData.append("id", '2');
    formData.append("type", 'top');

    // ファイル送信
    $.ajax({
      url: $($('.form_up2')).attr('action'),
      type:'POST',
      enctype  : 'multipart/form-data',
      processData: false,
      contentType: false,
      dataType: 'json',
      // サーバに送信するデータ
      data : formData
    }).then(
      function(res) {
        // エラーあり
        if (res.error) {
          alert(res.message);
          return;
        }

        // エラーがなければ更新のajaxを送信

        // ファイルサイズとファイル名をセット
        $('#topledgerFile2').val(res.filename);
        $('#topfileSize2').val(res.filesize);

        var formData = new FormData($('#fileRecord2')[0]);

        $.ajax({
          url: './topledger/topedit',
          type:'POST',
          enctype  : 'multipart/form-data',
          processData: false,
          contentType: false,
          dataType: 'json',
          // サーバに送信するデータ
          data: formData
        }).then(
          function(res) {
            if (res.error) {
              alert('更新に失敗しました');
              return;
            }

            alert('更新しました');
            window.location.reload();
          },
          function(XMLHttpRequest, textStatus, errorThrown) {
            alert("更新に失敗しました");
          }
        );
      },
      function(XMLHttpRequest, textStatus, errorThrown) {
        alert('ファイルのアップロードに失敗しました。');
      }
    );
  }); // $('#fileup_center').on('change') ここまで

	$('#fileup_right').on('change', function() {

		if (!confirm("アップロード更新しますか？")) {
			return false;
		}

    // 送信データ
    var formData = new FormData();
    formData.append("uploadFile", $('#fileup_right')[0].files[0]);
    formData.append("id", '3');
    formData.append("type", 'top');

    // ファイル送信
    $.ajax({
      url: $($('.form_up3')).attr('action'),
      type:'POST',
      enctype  : 'multipart/form-data',
      processData: false,
      contentType: false,
      dataType: 'json',
      // サーバに送信するデータ
      data : formData
    }).then(
      function(res) {
        // エラーあり
        if (res.error) {
          alert(res.message);
          return;
        }

        // エラーがなければ更新のajaxを送信

        // ファイルサイズとファイル名をセット
        $('#topledgerFile3').val(res.filename);
        $('#topfileSize3').val(res.filesize);

        var formData = new FormData($('#fileRecord3')[0]);

        $.ajax({
        	url: './topledger/topedit',
        	type:'POST',
        	enctype  : 'multipart/form-data',
        	processData: false,
        	contentType: false,
        	dataType: 'json',
        	// サーバに送信するデータ
        	data: formData
        }).then(
        	function(res) {
            if (res.error) {
              alert('更新に失敗しました');
              return;
            }

            alert('更新しました');
        		window.location.reload();
        	},
        	function(XMLHttpRequest, textStatus, errorThrown) {
        		alert("更新に失敗しました");
        	}
        );
      },
      function(XMLHttpRequest, textStatus, errorThrown) {
        alert('ファイルのアップロードに失敗しました。');
      }
    );
	});

    $('.btn_preview').on('click', function() {
      var $iframe = $('#modal-pre_top').find('iframe');
      var src = $iframe.attr('src');
      $iframe.attr('src', src);
    });


    // トップページ
    $('#submitbtn').on('click', function() {

        if(!confirm("新規カテゴリ追加しますか？")) {
            return false;
        }

        var hostUrl= './index/add';
        var data = {
        	id : $('#id').val(),
        	cateName : $('#cateName').val(),
        	imgName : $('#imgName').val(),
        	anchorName : $('#anchorName').val(),
        	priority : $('#priority').val(),
            dir : $('#dir').val()
        };

        $.ajax({
            url: hostUrl,
            type:'POST',
            dataType: 'json',
            // サーバに送信するデータ
            data : data
        })
        .then(
            function(res) {
                if (res.error) {
                  // エラーメッセージ res.messages を何らか出力
                  var displayMessage = 'エラーがあります\n\n';
                  $.each(res.messages, function(key, msg) {
                    // メッセージが空でなければ追加
                    if (msg !== '') {
                      displayMessage += msg + '\n';
                    }
                  });
                  alert(displayMessage);
                  return;
                }

                // エラーがない場合、画面をリロード
                alert("新規カテゴリを追加しました");
                window.location.reload();
            },
            function(XMLHttpRequest, textStatus, errorThrown) {
                alert("新規カテゴリ追加に失敗しました");
            }
        );
    });

    $('#submitbutton').on('click', function() {
    if(!confirm("更新しますか？")) {
      return false;
    }

    var hostUrl = './index/edit';
    var formData = new FormData($('#category')[0]);

    $.ajax({
      url: hostUrl,
      type:'POST',
      enctype  : 'multipart/form-data',
      processData: false,
      contentType: false,
      dataType: 'json',
      // サーバに送信するデータ
      data : formData
    }).then(
      function(res) {
        if (res.error) {
          // エラーメッセージ res.messages を何らか出力
          var displayMessage = 'エラーがあります\n\n';
          $.each(res.messages, function(key, msg) {
            // メッセージが空でなければ追加
            if (msg !== '') {
              displayMessage += msg + '\n';
            }
          });
          alert(displayMessage);
          return;
        }

        // エラーがない場合、画面をリロード
        alert("更新しました");
        window.location.reload();
      },
      function(XMLHttpRequest, textStatus, errorThrown) {
        alert("更新に失敗しました");
      });
    });

    // 統一帳票ページ設定
    // カラーパレット選択設定
    $('.color').paletteColorPicker({
    colors: [
      {"#E04F9B": "#E04F9B"}
    ],
    position: 'upside' // default -> 'upside'
  });

   $('.bgColor').paletteColorPicker({
    colors: [
      {"#FCFBEF": "#FCFBEF"}
    ],
    position: 'upside' // default -> 'upside'
  });


//削除設定
      $(".btn_del").on('click', function() {

        if(!confirm("削除しますか？")) {
                return false;
            }
          });
// 帳票ファイルアップロード設定
      $(".uf1").on('change', function() {

        if(!confirm("アップロードしますか？")) {
                return false;

            } else {

        // 親の要素を取得
        var $parent = $(this).closest('tr');

        var formData = new FormData();
        formData.append("uploadFile", $parent.find('.ledgerFiles').get(0).files[0]);
        formData.append("idCategory", $parent.find('input[name="idCategory[]"]').val());

        $.ajax({
            url: $($('.form2')).attr('action'),
            type:'POST',
            enctype  : 'multipart/form-data',
            processData: false,
            contentType: false,
            dataType: 'json',
            // サーバに送信するデータ
            data : formData
        }).then(
          function(data) {
            $parent.find('.ledgerFile').val(data.filename);
            $parent.find('.fileSize').val(data.filesize);
            $parent.find('.ledgerFileName').text(data.filename + '(' + data.filesize + ')');
          },
          function(XMLHttpRequest, textStatus, errorThrown) {
            alert('ファイルのアップロードに失敗しました。');
          }
        );

      }
      });

// ajax通信設定
  $('.submitbtn2').on('click', function() {
    var $form = $(this).closest('.categoryUnit').find('.editledger');

    if (!confirm("更新しますか？")) {
      return false;
    }

    var hostUrl = './../ledger/changeledger';

    $.ajax({
        url: hostUrl,
        type:'POST',
        dataType: 'json',
        data : $form.serialize()
        // data : formData
    }).then(
      function(res) {
        // エラーあり
        if (res.error) {
          return;
        }

        // 更新完了
        alert("更新しました");

        // 更新色を削除
        $form.find('.changed').removeClass('changed');

        console.log(res);
        /*window.location.reload();*/
      },
      function(XMLHttpRequest, textStatus, errorThrown) {
        alert("更新に失敗しました");
      }
    );
  });



  // 並び替え終了時のイベント
  $( ".jquery-ui-sortable" ).on( "sortupdate", function( event, ui ) {
    var $tbody = $(event.target);
    var len = $tbody.find('tr').length;
    var formData = {};
    $tbody.find('tr').each(function(i) {
      var $tr = $(this);
      console.log('itemId = ' + $tr.data('id') + ' ' + 'index = ' + i + ' priority = ' + (len - i));

      formData[i] = {
        itemId: $tr.data('id'),
        priority: (len - i)
      };
    });

    $.ajax({
        url: './../ledger/sort',
        type:'POST',
        dataType: 'json',
        // contentType: 'application/json',
        // サーバに送信するデータ
        data : {'list': formData}
    }).then(
      function(data) {
        // 成功した時は画面を更新する
        alert('並び替えが完了しました');
      },
      function(XMLHttpRequest, textStatus, errorThrown) {
        alert('並び替えに失敗しました。');
      }
    );

  } );

  $('.public').on('click', function() {

    if(!confirm("本番反映しますか？")) {
      return false;

    }
  });

  $('.reset').on('click', function() {

    if(!confirm("リセットしますか？\n(本番の状態にstaging環境が変更されます。＊ファイルなども全て戻ります。)")) {
      return false;

    }
  });

  $('.btn_delete').on('click', function() {
    if (!confirm("削除してよろしいですか？\n(公開側では見えなくなりますが、管理側には残ります)")) {
      return false;
    }
  });

  $('.btn_undelete').on('click', function() {
    if (!confirm("削除を取り消してよろしいですか？")) {
      return false;
    }
  });

    $('.display').on('change', function(e){

        var $parent = $(this).closest('tr');
        var $selectDis = $parent.find('select[name="display[]"]').val();

        if($selectDis == 0){
            $parent.find('p.h_comment').hide();

        } else {

            $parent.find('.h_comment').show();

        }
        e.preventDefault();
    });
    // 画面読み込み時に一度実行
    $('.display').trigger('change');

    // プレビューボタンのクリック時、iframeの画面を初期化する
    $('.btn_preview').on('click', function() {
      var $iframe = $('#modal-pre').find('iframe');
      var src = $iframe.attr('src');
      $iframe.attr('src', src);
    });

    // 新規帳票追加のクリック時、カテゴリーをセットする
    $('.btn_new').on('click', function() {
      var $modal = $('#modal-cate3');
      var $btn = $(this);
      $modal.find('.categoryName').text($btn.closest('.categoryUnit').find('h2').text());
      $modal.find('.idCategory').val($btn.data('category'));
    });

    // 指定要素の親のtdに changed クラスを付与する
    function markChanged(el) {
      $(el).closest('td').addClass('changed');
    }

    $(document).on('change', 'table input', function() {
      markChanged(this);
    });

    $(".btn_undelete").closest("tr").css("background-color","#ffc7bd");


    // 統一帳票編集

// 日付選択カレンダー設定
        $('.datepicker_add').datepicker({
            format: 'yyyy-mm-dd',
            language: 'ja'
        });

// カラーパレット選択設定
        $('.color_add').paletteColorPicker({
            colors: [
                {"#E04F9B": "#E04F9B"}
            ],
            position: 'upside' // default -> 'upside'
        });

        $('.bgColor_add').paletteColorPicker({
            colors: [
                {"#FCFBEF": "#FCFBEF"}
            ],
            position: 'upside' // default -> 'upside'
        });

// 新規帳票ファイルアップロード設定
        $("#ledgerFile1").on('change', function() {

            /*if(!confirm("アップロードしますか？")) {
                return false;

            } else {*/

                var formData = new FormData();
                formData.append("uploadFile", $('#ledgerFile1').get(0).files[0]);
                formData.append("idCategory", $('#addledger .idCategory').val());

                $.ajax({
                    url: $($('#form1')).attr('action'),
                    type:'POST',
                    enctype  : 'multipart/form-data',
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    // サーバに送信するデータ
                    data : formData
                }).then(
                    function(data) {
                        $('#ledgerFile').val(data.filename);
                        $('#fileSize').val(data.filesize);
                    },
                    function(XMLHttpRequest, textStatus, errorThrown) {
                        alert('ファイルのアップロードに失敗しました。');
                    }
                );

            /*}*/
        });

// ajax通信設定
        $('#submitbtn3').on('click', function() {

            if(!confirm("追加しますか？")) {
                return false;

            }

            var hostUrl= './../ledger/addledger';
            var formData = new FormData($('#addledger')[0]);
            console.log(formData);

            $.ajax({
                url: hostUrl,
                type:'POST',
                enctype  : 'multipart/form-data',
                processData: false,
                contentType: false,
                dataType: 'json',
                // サーバに送信するデータ
                data : formData
            }).then(
                function(res) {
                    if (res.error) {
                      // エラーメッセージ res.messages を何らか出力
                      var displayMessage = 'エラーがあります\n\n';
                      $.each(res.messages, function(key, msg) {
                        // メッセージが空でなければ追加
                        if (msg !== '') {
                          displayMessage += msg + '\n';
                        }
                      });
                      alert(displayMessage);
                      return;
                    }
                    alert("帳票を追加しました");
                    window.location.reload();
                },
                function(XMLHttpRequest, textStatus, errorThrown) {
                    alert("帳票の追加に失敗しました");
                }
            );
        });




});
