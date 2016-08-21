<?php

class Application_Form_Category extends Zend_Form
{
	public function init()
	{
		$this->setName('category');
		$id = new Zend_Form_Element_Hidden('id');
		/*$id->addFliter('Int');*/

		$cateName = new Zend_Form_Element_Text('cateName');
		$cateName->setLabel('カテゴリ名')
					  ->setRequired(true)
					  /*->addFliter('StripTags')
					  ->addFliter('StringTrim')*/
					  ->addValidator('NotEmpty');
					  /*->addDecorator(new Zend_Form_Decorator_Label(array('tag' => 'dt', 'class' => 'design1'))
					                                               );*/

		$imgName = new Zend_Form_Element_Text('imgName');
		$imgName->setLabel('画像名')
					 ->setRequired(true)
					 /*->addFliter('StripTags')
					 ->addFliter('StringTrim')*/
					 ->addValidator('NotEmpty');

		$anchorName = new Zend_Form_Element_Text('anchorName');
		$anchorName->setLabel('アンカー名')
					  ->setRequired(true)
					  /*->addFliter('StripTags')
					  ->addFliter('StringTrim')*/
					  ->addValidator('NotEmpty');

		$priority = new Zend_Form_Element_Text('priority');
		$priority->setLabel('優先度')
					  ->setRequired(false)
					  /*->addFliter('StripTags')
					  ->addFliter('StringTrim')*/
					  ->addValidator('NotEmpty');

	  $submit = new Zend_Form_Element_Submit('submit');
      $submit->setAttrib('id', 'submitbutton');

      $this->addElements(array($id, $cateName, $imgName, $anchorName, $priority, $submit));
	}
}