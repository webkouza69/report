<?php
/**
 * 統一帳票閲覧用のliを作成して返す
 */
class TN_View_Helper_Lis extends Zend_View_Helper_Abstract
{
    public function lis(array $arr, $selected = 1)
    {
        $ret = array();
        // 属性値をエスケープする関数
        // 値を変換する
        foreach ($arr as $val) {
            $ret[] = '<li data-menu-name="' . $this->escape_attr_string($val['name']) . '">' . htmlspecialchars($val['title'], ENT_QUOTES, 'UTF-8', false) . '</li>';
        }
        // 結合して返す
        return implode("\n", $ret) . "\n";
    }

    private function escape_attr_string($s)
    {
        return preg_replace_callback('/[^-\.0-9a-zA-Z]+/u', function ($matches) {
            $u16 = mb_convert_encoding($matches[0], 'UTF-16');
            return preg_replace('/[0-9a-f]{4}/', '\u$0', bin2hex($u16));
        }, $s);
    }
}
