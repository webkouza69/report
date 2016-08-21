<?php

class Application_Form_Ledger extends Zend_Form
{
	public function init()
	{
		$this->setName('ledger');
		$id = new Zend_Form_Element_Hidden('id');
		/*$id->addFliter('Int');*/

		$cateName = new Zend_Form_Element_Text('cateName');
		$cateName->setLabel('連番')
					  ->setRequired(true)
					  /*->addFliter('StripTags')
					  ->addFliter('StringTrim')*/
					  ->addValidator('NotEmpty');

		$imgName = new Zend_Form_Element_Text('imgName');
		$imgName->setLabel('帳票名')
					 ->setRequired(true)
					 /*->addFliter('StripTags')
					 ->addFliter('StringTrim')*/
					 ->addValidator('NotEmpty');

		$anchorName = new Zend_Form_Element_Text('anchorName');
		$anchorName->setLabel('更新日')
					  ->setRequired(true)
					  /*->addFliter('StripTags')
					  ->addFliter('StringTrim')*/
					  ->addValidator('NotEmpty');

		$priority = new Zend_Form_Element_Text('priority');
		$priority->setLabel('表示設定')
					  ->setRequired(true)
					  /*->addFliter('StripTags')
					  ->addFliter('StringTrim')*/
					  ->addValidator('NotEmpty');

	  $submit = new Zend_Form_Element_Submit('submit');
      $submit->setAttrib('id', 'submitbutton');

      $this->addElements(array($id, $cateName, $imgName, $anchorName, $priority, $submit));
	}
}