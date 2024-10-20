<?php // 2021-08-10 Copyright Klaus Eisert
include str_repeat('../',$GLOBALS['script_depth'])."tcpdf/tcpdf.php";

class jsonPDF extends TCPDF {
    public $_pagewidth;
    public $_tmargin;
    public $_lmargin;
    public $_rmargin;
    public $_bmargin; //not used
    public $_pagetop; //not used
    public $_pageheight; // getPageHeight()-_bmargin
    public $_heightheader;
    public $_heightfooter;
    public $page_no;
    public $mx;
    public $my;
    public $bafterheader;
    public $bfooter;
    public $bheader;
    public $y_end_pageheader;
    public $data_sel; // Array mit Ausgabe bereichen
    public $data;
    public $dat;
    public $header_actual;
    public $footer_actual;
    public $error;
    public $level;
    public $celldefaultheight;    
    public $borderdefault;
    public $maxy;
    public $boutput;
    public $proti;
    public $echo;
    
    public function _PrintOut($data_sel,$data,$dest='I',$filename="test.pdf",$clause=''){
        // $data contains the data, can be empty
        $this->echo=0;  //0-no echo, 2: log.txt
        $res=false;
        $this->level=0;
        
        $this->header_actual='pageheader';
        $this->footer_actual='pagefooter';
        $this->data_sel[$this->level]=$data_sel;
        
        //mylog(array("Started"=>true),$this->echo);

        $this->data_sel[0]['page']['top']=getfromArray($this->data_sel[0]['page'],"top",0);
        if(!isset($this->data_sel[$this->level]['page']) or !isset($this->data_sel[$this->level]['pageheader']) or !isset($this->data_sel[$this->level]['pagefooter'])){
            $this->error='page, pageheader, pagefooter!<br>';
            return 0;
        }
        if(!isset($this->data_sel[0]['page']['bottom'])){
          if(isset($this->data_sel[0]['page']['height'])){
            $this->data_sel[0]['page']['bottom']=$this->getPageHeight()-$this->data_sel[0]['page']['top'];
          }else{
            $this->data_sel[0]['page']['bottom']=PDF_MARGIN_BOTTOM;
          }
        }
        $this->data_sel[$this->level]['page']['left']=getfromArray($this->data_sel[$this->level]['page'],'left',0);
        $this->data_sel[$this->level]['page']['right']=getfromArray($this->data_sel[$this->level]['page'],'right',0);
        if($this->data_sel[$this->level]['page']['right']==-1)$this->data_sel[$this->level]['page']['right']=$this->data_sel[$this->level]['page']['left'];
        if(!isset($this->data_sel[$this->level]['page']['width'])){
          $this->data_sel[$this->level]['page']['width']=$this->getPageWidth()-$this->data_sel[$this->level]['page']['left']-$this->data_sel[$this->level]['page']['right'];
        }
                
        $temp=round($this->getPageWidth()-$this->data_sel[$this->level]['page']['leftpos']-$this->data_sel[$this->level]['page']['width']);
        $this->_SetMargins($this->data_sel[$this->level]['page']['leftpos'],$this->data_sel[$this->level]['page']['top'],$temp);

        //Seitenanfang
        $this->_heightheader=$data_sel['pageheader']['height'];
        $this->_heightfooter=$data_sel['pagefooter']['height'];
        //$this->_pagetop=$this->_heightheader;
        //$this->_pageheight=$this->getPageHeight()-$this->_heightheader-$this->_heightfooter;
        //$this->_pageheight=$this->getPageHeight()-$this->data_sel[0]['page']['top']-$this->data_sel[0]['page']['bottom'];
        $this->_pageheight=$this->getPageHeight()-$this->data_sel[0]['page']['bottom'];

        mylog(array("page height"=>$this->_pageheight),$this->echo);
        
        //setPageUnit( $unit )
        //setPageFormat( $format, $orientation = 'P' )
        //setPageOrientation( $orientation, $autopagebreak = '', $bottommargin = '' )        

        //$this->setCellMargins(0,0,0,0);
        $this->setCellPaddings(0,0,0,0);
        
        //$this->my=50;
        //$yoffset=50;
        $this->celldefaultheight=5;
        $this->proti=10;
        $this->borderdefault=0;     //1 set border
        $this->SetLineWidth(0.1);
        $this->bafterheader=false;
        $this->bfooter=false;
        
        $this->data[$this->level]=$data;
        $this->SetCreator(PDF_CREATOR);
        $this->SetAuthor(getfromarray($this->data[$this->level],'pdf.author',''));
        $this->SetTitle(getfromarray($this->data[$this->level],'pdf.title',''));
        $this->SetSubject(getfromarray($this->data[$this->level],'pdf.subject',''));
        $this->SetKeywords(getfromarray($this->data[$this->level],'pdf.keywords',''));
        $this->setJPEGQuality(90);
        
        $this->AddPage();

        //mylog("vor paddings",$this->echo);
        //mylog($this->getCellPaddings(),$this->echo);
        $this->SetCellPadding(1);
        //$this->boutput=1;
        //if($this->_PrintOutSection($data_sel,$data,0,0,$yoffset)){

        $dat_parent=array();
        foreach($data as $k=>$v){
            if(!is_numeric($k) and !is_array($v)){
                $dat_parent['parent.'.$k]=$v;
            }
        }
        if(0){echo '$this->level='.$this->level.'<br>';
            echo '<pre>';
            print_r($data);
            print_r($dat_parent);
            echo '</pre>';exit;}
        
        if($this->_PrintOutSection($data_sel,$data['data'],0,$dat_parent,$this->_tmargin)){
          /*
          echo '<pre>';
          print_r($this->getMargins());
          echo '</pre>';
          */
          $this->Output($filename, $dest);
          //$this->Output('', $dest);    
          $res=true;
        }else{
          //echo "error:";
        }
        return $res;
    }
        
    public function _PrintOutSection($data_sel,$data,$dat_selparent=0,$dat_parent=0,$yp=0){
        //$bfirst=($this->level==-1);
        $this->level=$this->level+1;
        $y=$yp;
        mylog(array("_PrintOutSection.yp"=>$y),$this->echo);

        $this->data_sel[$this->level]=$data_sel;
        $this->data[$this->level]=$data;
        
        //if($this->boutput){
        if(0){
            if(isset($data_sel['page'])){
              echo $y.' / '.$bfirst.' / '.$this->_tmargin.' / '.$data_sel['page']['top'].'<br>';
            }else{
              echo $y.' / '.$bfirst.'<br>';
            }
            echo '<pre>';
            print_r($data_sel);
            //print_r($data);
            echo '</pre>';
        }
        //$this->CreateTextBox($this->_lmargin.'/'.$this->_tmargin.'/'.$this->_rmargin.'/'.$this->_bmargin.'/', $this->_lmargin, $this->my);
        
        // print reportheader
        if(isset($this->data_sel[$this->level]['reportheader']['subs'])){
            $data_section=$this->data_sel[$this->level]['reportheader'];
            $y=$y+$data_section['top'];
            $y=$this->bPrintsection($this->data_sel[$this->level]['reportheader'],array(),$this->mx,$y);
            //$y=$y+$data_section['height'];
        }

        // =====================  Leerzeilen
        /*
        if(is_array($dat_selparent)){
            //echo '<pre>';
            //print_r($dat_selparent);
            //print_r($arr_specification);
            //echo '</pre>';
            //exit;
            if(isset($dat_selparent['mydefault'])){
                parse_str($dat_selparent['mydefault'],$arr_specification);
                //echo '<pre>';
                //print_r($dat_selparent);
                //print_r($arr_specification);
                //echo '</pre>';
                //exit;
                $minlines=getfromarray($arr_specification,'minlines',0);
                //echo '$minlines='.$minlines.'<br>';
                //exit;
                if($minlines>0){
                    while(count($this->data[$this->level])<$minlines):
                        $this->data[$this->level][]=array();
                    endwhile;
                }
            }
        } 
         * 
         */       
        $n=0;
        
        // =====================  loop data-array, Schleife um die Daten
        if(0){echo '$this->level='.$this->level.'<br>';
            echo '<pre>';
        print_r($data);
        echo '</pre>';exit;}
        
        if(is_array($this->data[$this->level])){
            foreach($this->data[$this->level] as $k=>$v){
                $dat=array_merge($v,$dat_parent);
                if(0){echo '<pre>';
                print_r($dat);
                echo '</pre>';}
                $maxy=0;
                $this->dat[$this->level]=$dat;

                // print groupheader
                /*
                foreach($this->data_sel[$this->level] as $dat_seltemp){
                    if($dat_seltemp['fieldtype']=105){
                        
                    }
                }
                if($groupfirst or $dat[$groupfield[$grouplevel]])<>$groupfield[$grouplevel]){
                   $groupfirst=false;
                   $dat[$groupfield[$grouplevel]]=$groupfield[$grouplevel]);
                   $this->bPrintsection($this->data_sel[$this->level][$offset],$dat,$this->mx,$this->my);
                }
                */
        
                // print $dat
                if($this->boutput){
                    if(isset($dat['mwst'])){
                        echo 'Schleife mwst='.$dat['mwst'].'<br>';
                    }elseif(isset($dat['docID'])){
                        echo 'Schleife docID='.$dat['docID'].'<br>';
                    }else{
                        echo 'Schleife=?'.'<br>';
                    }
                }
                $n++;

                if(isset($this->data_sel[$this->level]['detail']['subs'])){
                    $data_section=$this->data_sel[$this->level]['detail'];
                    $bfixedheight=($this->data_sel[$this->level]['detail']['specification']=='height=fix');
                    $bfixedheigh=1;    //!!!!!!!!!!
                    $yold=$y;
                    if($bfixedheight)$yold=$y;

                    $page_before=$this->page;
                    $y=$y+$this->data_sel[$this->level]['detail']['top'];
                    mylog(array("y before printsection"=>$y),$this->echo);
                    
                    $y=$this->bPrintsection($this->data_sel[$this->level]['detail'],$dat,$this->mx,$y);
                    //mylog(array("l"=>$this->level,"k"=>$k,"ypos"=>$this->GetY()),$this->echo);
                }

                // print groupfooter
            }
        }
                
        // print reportfooter
        if(isset($this->data_sel[$this->level]['reportfooter']['subs'])){
            $data_section=$this->data_sel[$this->level]['reportfooter'];
            $y=$y+$data_section['top'];
            $y=$this->bPrintsection($this->data_sel[$this->level]['reportfooter'],$this->data[$this->level],$this->mx,$y);
            //$y=$y+$data_section['height'];
        }
        $this->level=$this->level-1;
        return $y;
    }
    
    public function bPrintSection($data_section,$dat,$xp,$yp,$bhf=0){
        // $xp,$yp are the positions of the main object: data_section (values without margin?)
        //echo $this->getPage().'/'.$this->level.' bPrintSection.'.$data_section['fieldname'].'<br>';
        if(!$bhf)$this->page_no=$this->getPage();
        $yenlarge=0;    //important  for all elements of the section
        $y_previous=0;
        $ylast=0;
        $ylastsection=0;
        $yfirst=0;
        $ynextpage=0;
        $bfirst=true;
        $this->page_no=$this->getPage();
        $page_no_start=$this->page_no;
        
        // this offset should be regarded in parent!
        //$yp=$yp+$data_section['top']; //yoffset ?
        //$xp=$xp+$data_section['left']; 
        $bok=true;
        if(!glclng($data_section['enabled'])){
            // nothing
            $bok=false;
        }else if(!isset($data_section['subs'])){
            $bok=false;
        }
        if($bok){
            //mylog(array("start"=>$this->level,"main.yp"=>$yp,"fn"=>$data_section['label']." ".$data_section['fieldname']." ".$data_section['mycolumn']),$this->echo);  
            $data_subs=$data_section['subs'];
            foreach($data_subs as $dat_sel){
                $bcalulate_ylast=true;
                $boutput=true;
                //mylog(array("fieldname"=>$dat_sel['fieldname'],"visibleeval="=>$dat_sel['visibleeval']),$this->echo);  
                // -----  display: enable / visible
                if(!glclng($dat_sel['enabled'])){
                    goto next_dat_sel;
                }elseif(strlen($dat_sel['visibleeval'])>0){
                    $temp=gsReplaceFromArray($dat,$dat_sel['visibleeval']);
                    if(isset($dat['data'][0])){
                        $temp=gsReplaceFromArray($dat['data'][0],$temp);
                    }
                    //mylog(array("fieldname"=>$dat_sel['fieldname'],'visibleeval'=>$temp),$this->echo);
                    try{
                        @eval("\$boutput=(".$temp.");");
                    }
                    catch(Throwable $t) {
                        //mylog('eval error in expression:'.$temp,$this->echo);
                        //var_dump(debug_backtrace());
                        $boutput=false; 
                    }
                    //mylog($dat_sel['fieldname'].' '.iif($boutput,'output=true','output=false').' visibleeval: '.($temp),$this->echo);
                }
                
                $x=$xp+$dat_sel['leftpos'];
                if($this->bafterheader){
                    //if($dat_sel['label']=="Anschrift")mylog(array("after_header"=>$y),$this->echo);
                    //$y=$this->my;
                    $y=$this->GetY();
                    /*
                    if($bfirst){
                        if($this->getPage()==1){
                          $y=$yp+$dat_sel['top'];
                        }else{
                          //$y=$dat_sel['yoffset'];
                          $y=$this->_tmargin;
                          $bfirst=false;
                        }
                    }
                     */
                    if($this->getPage()==1){
                      $y=$yp+$dat_sel['top'];
                    }else{
                      $y=$this->_tmargin;
                    }
                    mylog(array("after_header"=>$y,"_tmargin"=>$this->_tmargin),$this->echo);
                }else if($bfirst){
                    $y=$yp+$dat_sel['top'];
                    if($this->bfooter){
                    }else if($y>$this->_pageheight){
                        mylog(array("zu gross"=>$ylast+$dat_sel['yoffset']),$this->echo);
                        $this->addPage();
                        $y=$this->my;
                        $y=$this->_tmargin;
                    }
                    //if($dat_sel['label']=="Anschrift")mylog(array("bfirst"=>""),$this->echo);
                    $bfirst=false;
                    $yfirst=$y;
                    mylog(array("first $y"=>$y),$this->echo);
                }else if($this->bfooter){
                    $y=$ylast+$dat_sel['yoffset'];
                    //if($dat_sel['label']=="Anschrift")mylog(array("bfooter"=>""),$this->echo);
                }else if($ylast+$dat_sel['yoffset']>$this->_pageheight){
                    //if($dat_sel['label']=="Anschrift")
                    //if($dat_sel['label']=="Anschrift")mylog(array("zu groß,page height"=>$this->_pageheight),$this->echo);
                    $print=!(glclng($dat_sel['shrinkable']) and gbnull(getfromarray($dat,$dat_sel['mycolumn'])));
                    mylog(array("fieldname"=>$dat_sel['fieldname'],'shrinkable'=>glclng($dat_sel['shrinkable']),"gbnull"=>gbnull(getfromarray($dat,$dat_sel['mycolumn'])),"bfooter"=>$this->bfooter),$this->echo);
                    if($print){
                      mylog(array('addpage,$y'=>$y,"fieldname"=>$dat_sel['fieldname'],"bfooter"=>$this->bfooter),$this->echo);
                      $this->addPage();
                      $y=$this->my;
                      $y=$this->_tmargin;
                    }else{
                      goto next_dat_sel;
                    }
                    //$y=$ylast+$dat_sel['yoffset']-$this->_pageheight;
                }else if($dat_sel['sameline']){
                    $y=$y_previous;
                }else{
                    $y=$ylast+$dat_sel['yoffset'];
                    //mylog(array("else $y"=>$y),$this->echo);
                }
                if(!$boutput){
                    //$ylast=$y+$dat_sel['height'];
                    //$ylast=$y;
                    $bcalulate_ylast=true;
                    goto next_dat_sel;
                }
                
                $this->bafterheader=false;
                
                $out=array_merge(array("y"=>$y),$dat_sel);
                if(isset($out['subs'])) unset($out['subs']);
                //mylog($out,$this->echo);                
                //mylog(array("start"=>$this->level,"y"=>$y,"x"=>$x,"fn"=>$dat_sel['label']." ".$dat_sel['fieldname']." ".$dat_sel['mycolumn']),$this->echo);  //,"ylast"=>$ylast,"yoffset"=>$dat_sel['yoffset']

                switch($dat_sel['fieldtype']){
                case 100:
                    break;
                case 101:
                    break;
                case 102:
                    break;
                case 103:
                    break;
                case 104:
                    break;
                case 105:
                    break;
                case 106:
                    break;
                case 107:   //detail
                    $this->bPrintSection($dat_sel,$dat,$x,$y);
                    //if($enlargeable){
                        // $yp=  setzen
                    //}

                    break;
                case 108:   //section with recordset, OUT OF ORDER
                    $my_old=$y;
                    $y=$y;
                    $ystart=$y;
                    $this->mx=$x;
                    $datadef_sub=new datadefinitions();
                    $datadefID=$dat_sel['specification'];
                    if($datadef_sub->bload($datadefID)){
                        // actual values on stack
                        //$this->stack_datadefinitions=$this->datadefinitions;
                        //$this->stack_data=$this->data;
                        //$clause='serviceID='.$dat['docID'];
                        $clause='';
                        $arr_parentlink=explode(';',$dat_sel['parentlinkfields']);
                        $arr_childlink=explode(';',$dat_sel['childlinkfields']);
                        for($n=0;$n<count($arr_parentlink);$n++){
                            $clause=gsclauseand($clause,$arr_childlink[$n].'='.getfromarray($dat,$arr_parentlink[$n],''));
                        }
                        $sql=$datadef_sub->getsql($clause);
                        $data_datasub=$datadef_sub->dbclass->getentries($sql);
                        if($data_datasub){
                            //if($this->_PrintOutSection('',$datadef_sub,$data_datasub,$dat_sel)){
                            if($this->_PrintOutSection('',$datadef_sub,$datadef_sub->dataselections->data,$data_datasub,$dat_sel)){
                                // Berichtskopf
                                // Gruppenkopf
                                // Data
                                // Gruppenfuss
                                // Berichtsfuss
                                if($dat_sel['enlargeable']){  //enlarge
                                    $this->ln();
                                }
                            }
                        }
                        //$this->datadefinitions=$this->stack_datadefinitions;
                        //$this->dataselections=$this->datadefinitions->dataselections;
                        //$this->data_sel=$this->dataselections->data;
                        //$this->data=$this->stack_data;
                    }
                    break;
                case 109:   //panel, section data
                    $this->bPrintSection($dat_sel,$dat,$x,$y);
                    //if($enlargeable){
                        // $yp=  setzen
                    //}
                    break;
                case 110:   // Cell fixed size
                    //mylog(array("mycolumn"=>$dat_sel['mycolumn'],"content"=>getfromarray($dat,$dat_sel['mycolumn']),"shrinkable"=>$dat_sel['shrinkable'],"null"=>gbnull(getfromarray($dat,$dat_sel['mycolumn']))),$this->echo);
                    if($dat_sel['shrinkable'] and gbnull(getfromarray($dat,$dat_sel['mycolumn']))){
                        //no output
                        //mylog(array("$y"=>$y,"mycolumn"=>$dat_sel['mycolumn'],"nooutput"=>true),$this->echo);
                        $bcalulate_ylast=false;
                        $ylast=$y;
                        //$this->_Cell($x,$y,$dat_sel,$dat);
                    }else{
                        $this->_Cell($x,$y,$dat_sel,$dat);
                    }
                    break;
                case 111:   // Cell enlargeable
                    if(glclng($dat_sel['shrinkable']) and gbnull(getfromarray($dat,$dat_sel['mycolumn']))){
                    //if(0){
                        //no output
                        $bcalulate_ylast=false;
                    }else{
                        $ystart=$y;
                        $this->_Cell($x,$y,$dat_sel,$dat,1);
                        //if($dat_sel[''])
                        //if($y+$dat_sel['height']>$this->getY()-$y and $this->maxy<$this->getY()-$y){
                        //  $this->maxy=$this->getY()-$y;
                        //}
                        //$yenlarge=$this->GetY();
                        //$this->my=$this->GetY();
                        //$yenlarge=$this->my-$ystart-$dat_sel['height'];
                        //$yenlarge111=round($this->GetY()-$ystart-$dat_sel['height'],0);
                        //echo $dat_sel['fieldname'].', enlarge111 '.$yenlarge111.'<br>';
                        //$yenlarge=$yenlarge+$yenlarge111;

                        $ylast=$this->GetY();
                        $bcalulate_ylast=false;
                        /*if($dat_sel['fieldname']='textdimensions'){
                            $this->SetXY($this->proti,250);
                            $this->proti=$this->proti+20;
                            $this->Cell(50, 5, $yenlarge);
                        }
                         */
                    }
                    break;
                case 112:   // line
                    $style=array();
                    $specification=getfromArray($dat_sel,'specification');
                    if(is_array($specification)){
                      $style=getfromarray($specification,"style",array());
                    }
                    if(!gbnull($dat_sel['bordercolor'])){
                        $arr=hex2rgb($dat_sel['bordercolor']);
                        $this->SetDrawColor($arr[0],$arr[1],$arr[2]);
                    }
                    //if($y<0)$y=280;
                    $y2=$y;
                    $x2=0;
                    //if(!gbnull($dat_sel['height']))$y2=$y+$dat_sel['top']+$dat_sel['height'];
                    //if(!gbnull($dat_sel['width']))$x2=$x+$dat_sel['leftpos']+$dat_sel['width'];
                    if(!gbnull($dat_sel['height']))$y2=$y+$dat_sel['height'];
                    if(!gbnull($dat_sel['width']))$x2=$x+$dat_sel['width'];
                    $this->_Line($x, $y, $x2, $y2, $style);
                    mylog(array("x"=>$x,"y"=>$y,"x2"=>$x2,"y2"=>$y2,"width"=>$dat_sel['width'],"_pagewidth"=>$this->_pagewidth),$this->echo);
                    if(!gbnull($dat_sel['bordercolor'])){
                        $this->SetDrawColor(0);
                    }
                    break;
                case 113:   // box (4 lines)
                    break;
                case 114:   // image
                    //$link=getfromarray($dat,$dat_sel['specification'],'http://tom24.info/webkit');
                    $link='';
                    $specification=array();
                    if(is_array($dat_sel['specification'])){
                      $specification=$dat_sel['specification'];
                    }else{
                      parse_str($dat_sel['specification'],$specification);
                    }
                    $linkfield=getFromArray($specification,'linkfield');
                    if(gbnull($linkfield)){
                        $link=getfromarray($specification,'link','http://tom24.info/webkit');
                    }else{
                        // parent
                        $link=getfromarray($dat,$linkfield);
                    }
                    $filename=getfromarray($dat_sel,'label',$dat_sel['myextra']);
                    if(!gbnull(getfromarray($dat,$dat_sel['mycolumn'],''))){
                        $filename=getfromarray($dat,$dat_sel['mycolumn'],'');
                    }
                    if(gbnull($filename)){
                        //mylog(array("filename"=>$filename." empty"),$this->echo);
                    }
                    if(!gbnull($filename)){
                        if(@is_file($filename)){
                            $align='T';
                            $resize=false;
                            $dpi=300;
                            $palign=getFromArray($specification,'palign','L');
                            $this->Image($filename, $x, $y, $dat_sel['width'],$dat_sel['height'], 'JPG', $link, $align, $resize, $dpi, $palign); // (20*1.09)
                            //mylog(array("filename"=>$filename." printed"),$this->echo);
                        }else{
                            //mylog(array("filename"=>$filename." dont exist"),$this->echo);
                        }
                    }elseif($this->borderdefault){
                        $this->CreateTextBox($dat_sel['fieldname'], $x, $y, $dat_sel['width'],$dat_sel['height']);
                    }
                    break;
                case 115:  // svg
                    if(!gbnull(getfromarray($dat,$dat_sel['mycolumn'],''))){
                        $specification=array();
                        parse_str($dat_sel['specification'],$specification);
                        $imagescale=getFromArray($specification,'imagescale',1);
                        $link=getFromArray($specification,'link');;
                        $border=getfromarray($dat_sel,'border',$this->borderdefault);
                        $this->setImageScale($imagescale);
                        //$this->ImageSVG('@'.getfromarray($dat,$dat_sel['mycolumn'],''), $x,$y, $dat_sel['width'],$dat_sel['height'], $link='', $align='LTR', $palign='', $border=1, $fitonpage=1);
                        $this->ImageSVG('@'.getfromarray($dat,$dat_sel['mycolumn'],''), $x,$y,'',10, $link,'LTR','', $border, 0);
                        $this->setImageScale(1);
                    }
                    break;
                case 116:
                        //echo '<pre>';
                        //print_r($dat);
                        //print_r($dat_sel);
                        //echo '</pre>';
                    if(isset($dat[$dat_sel['specification']])){
                        $data_sub=$dat[$dat_sel['specification']];
                    }elseif($this->borderdefault){
                        $data_sub=array(0=>array());
                    }else{
                        $data_sub=array();
                    }
                    //mylog($dat_sel['fieldname'],$this->echo);
                    //mylog($data_sub,$this->echo);
                    $dat_parent=array();
                    foreach($dat as $k=>$v){
                        if(!is_numeric($k) and !is_array($v)){
                            $dat_parent['parent.'.$k]=$v;
                        }
                    }
                    $ylast=$this->_PrintOutSection($dat_sel['subs'],$data_sub,$dat_sel,$dat_parent,$y);
                    $bcalulate_ylast=false;
                    break;
                case 117:   // Cell enlargeable
                    if(glclng($dat_sel['shrinkable']) and gbnull(getfromarray($dat,$dat_sel['mycolumn']))){
                        $bcalulate_ylast=false;
                    }else{
                      if(!gbnull($dat_sel['mycolumn'])){
                        $ystart=$y;
                        //$this->setCellHeightRatio(0.8);
                        
                        $this->SetXY($x, $y);
                        $this->WriteHTML('<div style="line-height: 0.8;">'.getFromArray($dat_sel,'label').getFromArray($dat,$dat_sel['mycolumn']).'</div>');
                        //$this->WriteHTML(''.getFromArray($dat,$dat_sel['mycolumn']).'');
                        //public function writeHTML($html, $ln=true, $fill=false, $reseth=false, $cell=false, $align='') {
                        $ylast=$this->GetY();
                        $bcalulate_ylast=false;                    
                      }
                    }
                }
    next_dat_sel:
                $y_previous=$y;
                /*
                if($dat_sel['sameline']){
                    $ylast=$y+$dat_sel['height'];
                    //$ylast=$y;
                    ((mylog(array("sameline"=>$dat_sel['fieldname'],"height.ylast"=>$ylast),$this->echo);
                }else if($bcalulate_ylast){
                 */
                if($bcalulate_ylast){
                    if($dat_sel['shrinkable'] || $dat_sel['enlargeable'] || $this->getPage()!==$this->page_no) {
                        $ylast=$this->GetY();
                        $this->page_no=$this->getPage();
                        //mylog(array("end.schrink"=>$dat_sel['fieldname'],"shrink.ylast"=>$ylast),$this->echo);
                    }else{
                        $ylast=$y+$dat_sel['height'];
                        //mylog(array("end.height"=>$dat_sel['fieldname'],"height.ylast"=>$ylast),$this->echo);
                    }
                }
                //mylog($dat_sel['fieldname'].': ylast='.$ylast,$this->echo);
                if($ylast>$ylastsection)$ylastsection=$ylast;
                //echo $dat_sel['fieldname'].': my='.$this->my.', $yenlarge='.$yenlarge.'<br>';
            }
            if($data_section['fieldname']=='doc_section'){
                //echo 'Border: '.$data_section['border'].' / '.$data_section['backgroundcolor'].'<br>';
            }
            if(!gbnull($data_section['border']) or !gbnull($data_section['backgroundcolor'])){
                // bei Hintergrund oder Border ein Rechteck zeichnen
                if(gbnull($yenlarge)){
                }else{
                }
                //echo 'Rechteck<br>';
                $this->_Cell($xp,$yp,$data_section,$dat,1);
            }
            //if(instr('100,103,104,105,106,107,116',$data_section['fieldtype'])>=0){
                //$this->my=$yp+$data_section['height'];
            //    $this->my=$this->my+$data_section['height'];
            //}
        }else{
            $yfirst=$yp;
        }
        if($data_section['shrinkable'] || $data_section['enlargeable'] || $this->getPage()!==$page_no_start){
            if($this->getPage()!==$page_no_start){
                $ylast=$this->GetY();
            }else{
                $ylast=$ylastsection;
            }
            //mylog(array("shrinkable"=>$data_section['fieldname'],"ylast"=>$ylast),$this->echo);
        }else{
            $ylast=$yfirst+$data_section['height'];
            //mylog(array("fixed height"=>$data_section['fieldname'],"ylast"=>$ylast),$this->echo);
        }
        //return 1;
        return $ylast;
    }
    
    public function Header(){
        $this->bheader=true;
        $this->SetCellPadding(1);
        $right=-1;
        $y=$this->data_sel[0][$this->header_actual]['top'];
        $x=$this->data_sel[0][$this->header_actual]['left'];
        if(isset($this->data_sel[0][$this->header_actual]['right'])){
          
        }
        $x=$this->data_sel[0][$this->header_actual]['left'];
        $this->SetMargins($x,$this->_tmargin,$right);
        
        //$y=$this->bPrintSection($this->data_sel[0][$this->header_actual],$this->dat[0],$x,$y,1);
        $y=$this->bPrintSection($this->data_sel[0][$this->header_actual],$this->data[0],$x,$y,1);

        $this->SetMargins($this->_lmargin,$this->_tmargin,$this->_rmargin);
        
        //mylog(array("header.y"=>$y),$this->echo);
        //$y=$this->GetY();
        $this->y_end_pageheader=$this->GetY();
        mylog(array("level"=>$this->level),$this->echo);
        if($this->level>1){
            $reportheader=getfromarray($this->data_sel[$this->level],'reportheader',array());
            mylog($reportheader,$this->echo);
            if(isset($reportheader["pageheaderoffset"])){
              // 2ten Header ausgeben
              $x=$this->_lmargin;
              $y=$this->bPrintSection($this->data_sel[$this->level]['reportheader'],$this->data[$this->level],$x,$y+$reportheader["pageheaderoffset"]);
            }
        }
        $this->bafterheader=true;
        $this->my=$y;
        //$this->my=$this->data_sel[0]['page']['top']+$this->data_sel[0][$this->header_actual]['height'];
        $this->bheader=false;
    }
    
    public function Footer(){
        $this->bafterheader=false;
        $this->bfooter=true;
        if(0){
            //absolut
        }else{
            //$x=$this->_lmargin;
            //$x=$this->data_sel[0][$this->header_actual]['left'];
            $x=$this->data_sel[0][$this->footer_actual]['left'];
            //$y=$this->getPageHeight()-$this->_bmargin -$this->data_sel[0][$this->footer_actual]['height'];
            $y=$this->getPageHeight()-$this->_heightfooter;
            //$y=-20;
            mylog(array("$y"=>$y,"getPageHeight"=>$this->getPageHeight(),"_heightfooter"=>$this->_heightfooter),$this->echo);
        }
        //$this->bPrintSection($this->data_sel[0][$this->footer_actual],$this->dat[0],$x,$y,1);
        $this->bPrintSection($this->data_sel[0][$this->footer_actual],$this->data[0],$x,$y,1);
        
        //$this->SetY(-15);
        //$this->SetFont(PDF_FONT_NAME_MAIN, 'I', 8);
        //$this->Cell(0, 10, 'www.Einsatzmeldung.de powered by k8Management', 0, false, 'C');
        $this->bfooter=false;
    }
    
    public function _SetMargins($left, $top, $right=-1, $keepmargins=false) {
        $this->_lmargin=$left;
        $this->_tmargin=$top;
        if($right==-1){
          $this->_rmargin=$this->_lmargin;
        }else{
          $this->_rmargin=$right;
        }
        //$height=$this->data_sel[0]['page']['height'];
        //$this->_bmargin=round($this->getpageheight()-$this->_tmargin-$height);
        
        $this->_bmargin=$this->data_sel[0]['page']['bottom'];
                
        $this->mx=$this->_lmargin;
        mylog(array("top"=>$top,"left"=>$left,"right"=>$right),$this->echo);
        $this->SetMargins($left, $top, $right, $keepmargins);
        //$this->setHeaderMargin(20);
        $this->setFooterMargin(PDF_MARGIN_FOOTER);
        //$this->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM); // set auto page breaks
        $this->SetAutoPageBreak(TRUE, $this->_bmargin); 
        
        $this->_pagewidth=$this->getPageWidth()-$this->_lmargin-$this->_rmargin;
    }
    
    public function _Line($x1, $y1, $x2=0, $y2=0, $style=array()) {
        //$line_width = (0.2 / $this->k);
        //$this->SetLineStyle(array('width' => $line_width, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => $this->footer_line_color));
        //$this->SetLineStyle(array('width' => $line_width, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0));

        if(gbnull($x2))$x2=$this->_lmargin+$this->_pagewidth;
        if(gbnull($y2))$y2=$y1;
        //$this->Line($this->_lmargin+$x1, $y1, $x2, $y2, $style);
        $this->Line($x1, $y1, $x2, $y2, $style);
        mylog(array("x1"=>$x1,"y1"=>$y1,"x2"=>$x2,"y2"=>$y2),$this->echo);
        //$this->Cell(0,70,$dat_sel,$dat,$bmulti=0){
    }

    public function CreateTextBox($textval, $x=0, $y, $width=0, $height=5, $fontsize=10, $fontstyle='', $align = 'L',$border=1) {
        $this->SetXY($x, $y); // 20 = margin left
        $this->SetFont(PDF_FONT_NAME_MAIN, $fontstyle, $fontsize);
        $this->Cell($width, $height,$textval, $border, false, $align);
        //$this->my=$this->GetY();
    }

    public function _Cell($x,$y,$dat_sel,$dat,$bmulti=0){
        //$recordformat=$GLOBALS['generalformat'];
        //$recordformat=getfromarray($dat,'record.generalformat',0);
        $recordformat=0;
        //echo '$recordformat='.$recordformat.'<br>';
        //$dat_sel['bordercolor']='#000000';
        if(!gbnull($dat_sel['bordercolor'])){
            $arr=hex2rgb($dat_sel['bordercolor']);
            $this->SetDrawColor($arr[0],$arr[1],$arr[2]);
        }
        if(!gbnull($dat_sel['fontcolor'])){
            $arr=hex2rgb($dat_sel['fontcolor']);
            $this->SetTextColor($arr[0],$arr[1],$arr[2]);
            //echo 'color='.$dat_sel['fontcolor'].'/'.$arr[0].','.$arr[1].','.$arr[2].'<br>';
            //exit;
        }
        $bfill=false;
        if(!gbnull($dat_sel['backgroundcolor'])){
            $arr=sscanf($dat_sel['backgroundcolor'], "#%02x%02x%02x");
            //mylog($arr,$this->echo);
            $this->SetFillColor($arr[0],$arr[1],$arr[2]);
            $bfill=true;
        }
        if(0){
            echo 'dat<br>';
            echo '<pre>';
            print_r($dat);
            echo '</pre>';}
  
        $this->SetXY($x, $y);
        $label='';
        if(!gbnull($dat_sel['label'])){
            if(isset($this->data[0]['translate'])){
                $dat_sel['label']=getFromArray($this->data[0]['translate'],$dat_sel['label'],$dat_sel['label']);
                //if(instr($dat_sel['label'],'#ls#')>-1 and isset($this->data[0]['translate'])){
                if(instr($dat_sel['label'],'#ls#')>-1){
                    $texttemp=$dat_sel['label'];
                    $identifier="#ls#";
                    while(InStr($texttemp,$identifier)>=0){
                        $pos_start=strpos($texttemp,$identifier);
                        $pos_ende=strpos($texttemp,"#",$pos_start+strlen($identifier)+1);
                        //echo "pos_ende:".$pos_ende."<br>";
                        if($pos_ende>0){
                            $replace="";
                            $placeholder=substr($texttemp,$pos_start,$pos_ende-$pos_start+1);
                            $temp=substr($texttemp,$pos_start+strlen($identifier),$pos_ende-strlen($identifier)-$pos_start);
                            if(!gbnull($temp)){
                                //echo '$temp :'.$temp.'<br>';
                                $replace=getfromArray($this->data[0]['translate'],$temp);
                            }
                            $texttemp=str_replace($placeholder,$replace,$texttemp);
                        }else{
                            $texttemp=substr($texttemp,0,$pos_start).substr($texttemp,$pos_start+strlen($identifier));
                        }
                    }
                    $dat_sel['label']=$texttemp;
                }
            }
            $label=$dat_sel['label'];
            if(instr($dat_sel['label'],'{{')>-1){
                //eval?
                $label=gsReplaceFromArray($dat,$dat_sel['label']);
            }
        }
        //mylog(array("label"=>$label),$this->echo);
        
        $textval='';
        if(!gbnull($dat_sel['mycolumn'])){
            // parent?
            if(instr($dat_sel['mycolumn'],'parent')>-1){ // $dat_sel['mycolumn'] parent
                $arr=explode('.',$dat_sel['mycolumn']);
                $level=count($arr)-1;
                $mycolumn=$arr[count($arr)-1];
                if(isset($this->data[$this->level-$level][$mycolumn])){
                    $textval=$this->data[$this->level-$level][$mycolumn];
                }
            }else{
                if($this->borderdefault){
                    $temp=$dat_sel['fieldname'];
                    //echo '$textval='.$textval.'<br>';
                }elseif(isset($dat[$dat_sel['mycolumn']])){
                    //mylog($dat_sel,$this->echo);
                    if($dat_sel['datatype']==1){
                        if($recordformat==1){
                            $temp=number($dat[$dat_sel['mycolumn']]);
                        }else{
                            $temp=($dat[$dat_sel['mycolumn']]);
                        }
                        $temp=number_formatx($temp,$dat_sel['decimals'],0);
                    }else if($dat_sel['datatype']==4){
                        $temp=date($GLOBALS['generaldateformat'], gstr2timestamp($dat[$dat_sel['mycolumn']]));
                    }else{
                        $temp=getfromarray($dat,$dat_sel['mycolumn'],'');
                    }
                }else{
                    $temp=$dat_sel['mycolumn'].' invalid!';
                    $temp=''; //$dat_sel['mycolumn'].' invalid!';
                }
                $textval=gsclauseand($textval,$temp,1,' ');
                //echo $dat_sel['mycolumn'].'='.$textval.'<br>';
            }
        }
        //mylog(array("textval"=>$textval),$this->echo);
        $height=$dat_sel['height'];
        $border=getfromarray($dat_sel,'border',$this->borderdefault);
        $align=$this->Align($dat_sel['alignement']);
        $fontstyle=$dat_sel['fontstyle'];
        $fontfamily=getfromarray($dat_sel,'fontfamily',PDF_FONT_NAME_MAIN);
        $specification=array();
        parse_str($dat_sel['specification'],$specification);
        $link=$dat_sel['specification'];
        $fontsize=getfromarray($dat_sel,'fontsize',$this->tempfontsize,1);
        $this->SetFont($fontfamily, $fontstyle, $fontsize);
        if(0){
            if($textval=='Menge'){
                $this->CreateTextBox($align, $x=0, $y=250);
                echo '$align='.$align.'<br>';
                exit;
            }
            //if($dat_sel['fieldname']=='doc_section'){
                //echo 'x / y / multi: '.$x.' / '.$y.' / '.$bmulti.'<br>';
                echo 'Width / Height / Border / Background: '.$dat_sel['width'].' / '.$height.' / '.$border.' / '.$dat_sel['backgroundcolor'].'<br>';
            //}
        }
        $bok=true;
        if(gbnull($textval)){
             $bok=!$dat_sel['shrinkable'];
        }
        if($bok){
            //mylog(array("$y"=>$y,"textval"=>$textval),$this->echo);
            $clipwidth=getfromarray($specification,'clipwidth',0);
            //mylog(array("mycolumn"=>$dat_sel['mycolumn'],"clipwidth"=>$clipwidth),$this->echo);
            if(getFromArray($dat_sel,'labelwidth',0)<>0){
                $this->Cell($dat_sel['labelwidth'], $height, $label, $border, 1, $align,$bfill);
                $this->SetXY($x+$dat_sel['labelwidth'],$y);
                $this->Cell($dat_sel['width'], $height, $textval, $border, 1, $align,$bfill);
                if($this->getPage()==$this->page_no) $this->SetXY($x,$y+$dat_sel['height']);
            }elseif($bmulti){
                $this->MultiCell($dat_sel['width'], $height, gsclauseand($label,$textval,true,' '), $border, $align,$bfill);
            }elseif($clipwidth){
                $w=$dat_sel['width'];
                $this->StartTransform();
                $this->Rect($x, $y, $w, $height+2, 'CNZ');
                $this->Cell($w, $height, gsclauseand($label,$textval,true,' '), $border, 1, $align,$bfill);
                $this->StopTransform();
            }else{                
                $this->Cell($dat_sel['width'], $height, gsclauseand($label,$textval,true,' '), $border, 1, $align,$bfill);
            }
        }
        //mylog(array("_Cell.GetY"=>$this->GetY(),"height"=>$dat_sel['height']),$this->echo);
        //echo $x,$y,$textval.'<br>';
        if(!gbnull($dat_sel['bordercolor']))$this->SetDrawColor(0);
        if(!gbnull($dat_sel['fontcolor']))$this->SetTextColor(0);
    }
    
    public function Align($align){
        if(is_numeric($align)){
            switch($align){
            case 0:
                return 'L';
                break;
            case 1:
                return 'R';
                break;
            case 2:
                return 'C';
                break;
            case 3:
                return 'J';
                break;
            default:
                return $align;
            }
        }else{
                return $align;
        }
    }
}