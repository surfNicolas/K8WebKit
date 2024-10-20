<?php
require_once "config.CheckDataValidity.php"; //Konfigurationsskript für die Tests

class check
{
	//Datentypvariablen
	private $specificType = null;
	private $generalType = null;
	private $signed = true;
	private $value = null;
	private $typestring = null;

function gbcheckinputcol($colobject,$postfields,&$error,$exeptions='',$labels=''){
    //Rückgabe:     0: Fehler, 1:kein Fehler
    //$colobject:    array mit Datentypen: int(10), varchar(50)
    //$postfields:  array der Eingabefelder (Schleife über diese Array)
    //&$error:      Rückgabe, Fehlerbeschreibung
    //$exeptions:   Spalten, die nicht geprüft werden
    //$labels:      array mit feldlabels 
    Global $langclass;
    Global $langmodule;
    $result=true;
    foreach($postfields as $k=>$v) {
        if (gbnull($exeptions) or strpos($exeptions,"[".$k."]")==0) {
            if(isset($colobject[$k]['Field']) and isset($colobject[$k]['Type']) and isset($colobject[$k]['mytype'])){
                //mylog(array("$k"=>$v),2);
                $mytype=$colobject[$k]['mytype'];
                if(gbnull($v) and in_array($mytype,$GLOBALS['numericTypesAll'])){
                  // numerische Werte umwandeln
                  if($colobject[$k]['Null']=="NO"){
                    $v=0;
                  }else{
                    $v=null;
                  }
                  $postfields[$k]=$v;
                  //mylog(array("Umwandlung column"=>$k,"value"=>$v),2);
                }
                if($v===null and $colobject[$k]['Null']=="YES"){
                  // ok
                }elseif(!$this->checkData($colobject[$k]['Type'],$v)){
                  if(is_array($labels)){
                      $label=getfromarray($labels,$k,'');
                  }else{
                      //$label=$langclass->getlangValue($langmodule,$k);
                      $label=$k;
                  }
                  //$error.=$label." ".$langclass->getlangValue("system","invalid")."<br>"; // " ist ungültig!<br>";
                  $error.=$label." "."invalid"."<br>";
                }
            }
        }
    }
    return (strlen($error)==0);
  }
        
	/**
	 * Ruft den Check auf.
	 * 
	 * @return boolean Ergebnis der Wertüberprüfung
	 */
	public function checkData($typestring, $value)
	{
		//echo $typestring.'<br>';
		//Typestring speichern
		$this->typestring = $typestring;
		//Den Wert speichern.
		$this->value = $value;
		//Den Typ festlegen:
		$this->parseType();
                //echo '$this->generalType='.$this->generalType.'<br>';
		switch ($this->generalType)
		{

			case "Numeric" :
				return $this->checkNumericType();
			case "ComplexNumeric" :
				//Für decimal eine eigene Routine
				if ($this->specificType == "DECIMAL")
				{
					return $this->checkDecimalType();
				}
				else
				{
					return $this->checkComplexNumericType();
				}
			case "Set" :
				return $this->checkSetType();
			case "Date" :
				return $this->checkDateType();
			case "String" :
				return $this->checkStringType();
			case "Byte" :
				return $this->checkByteType();
				//Falls keiner der vorigen Fälle...nicht bekannter Typ
			default :
				return false;

		}

	}

	public function getType(){
		return $this->specificType;
	}

	private function parseType(){
		//Zeigt an, ob schon ein "Match" gefunden wurde.
		$searching = true;

		//Typ des $typestrings in allen Typ-Arrays testen.
		/****NUMERIC TYPES****/
		$searching = $this->parseSpecificArray($GLOBALS['numericTypesArray'], "Numeric");

		/*****SET AND ENUM******/
		//Auf enum Testen
		if ($searching == false){
			$searching = $this->parseSpecificArray($GLOBALS['setTypesArray'], "Set");
		}

		/****COMPLEX NUMERIC TYPES****/
		if ($searching == false){
			$searching = $this->parseSpecificArray($GLOBALS['complexNumericTypesArray'], "ComplexNumeric");
		}
		/****DATE-TYPES****/
		if ($searching == false){
			$searching = $this->parseSpecificArray($GLOBALS['dateTypesArray'], "Date");
		}

		/****STRING-TYPES****/
		if ($searching == false){
			$searching = $this->parseSpecificArray($GLOBALS['stringTypesArray'], "String");
		}

		/****BYTE-TYPES****/
		if ($searching == false){
			$searching = $this->parseSpecificArray($GLOBALS['byteTypesArray'], "Byte");
		}
	}

	/**
	 * Ruft die jeweilige Testfunktion anhand des Datentyps auf.
	 * 
	 * @param Array Spezifisches Datentyp-Array aus der Konfigurationsdatei
	 * @param varchar Typgruppe des Datentyps 
	 * 
	 * @return boolean Wird zum Abbrechen der Schleife benutzt
	 */
	private function parseSpecificArray($typeArray, $generalType)
	{

		//Reseten des Zeigers im NumericArray
		reset($typeArray);

		//Solange durchlaufen, wie Elemente im Array sind 
		//und noch nichts gefunden wurde.
		while ($type = current($typeArray))
		{
			//Den typestring prüfen...
			if (stripos(strtolower($this->typestring), strtolower($type)) !== false)
			{
				$this->specificType = $type;
				$this->generalType = $generalType;
				return true;
			}

			//Zeiger weiterrücken.
			next($typeArray);

		}

	}

	private function checkNumericType(){
		//Der Wert darf keinen Punkt enthalten.
		$point = stripos($this->value, ".");
                if($point!==false){
                    return false;
                }

		//Hier noch prüfen, ob der Typ "unsigned" ist
		if (stripos(strtolower($this->typestring), "unsigned") !== false){
			$this->signed = false;
		}

		//Minimum-Konstante
		$minConstant = $this->specificType."_";
		if (!$this->signed){
			$minConstant .= "UNSIGNED_";
		}
		$minConstant .= "MIN";

		//Maximum-Konstante
		$maxConstant = $this->specificType."_";
		if (!$this->signed){
			$maxConstant .= "UNSIGNED_";
		}
		$maxConstant .= "MAX";

		//Der Wert des numerischen Typen muss nun numerisch sein und zwischen
		//den beiden Grenzen liegen.
		if (is_numeric($this->value)){
			if (($this->value >= constant($minConstant)) && ($this->value <= constant($maxConstant)))
			{
				//Gültig
				return true;
			}
			else
			{
				//Ist zu groß oder zu klein
				return false;
			}
		}
		else
		{
			//Ist keine Zahl
			return false;
		}
	}

	/**
	* Überprüfung der komplexen numerischen Typen
	* FLOAT und DOUBLE. Für DECIMAL wird weitergeleitet.
	* @return boolean Gibt den Wert der Wertüberprüfung zurück
	*/
	private function checkComplexNumericType(){
		//Nicolas Der Wert darf keinen Punkt enthalten.
		//$point = stripos($this->value, ".");
                //if($point!==false){
                //    return false;
                //}

		//Minimum-Konstante
		$minConstant = $this->specificType."_MIN";

		//Maximum-Konstante
		$maxConstant = $this->specificType."_MAX";

		//Wenn UNSIGNED, dann dürfen keine negativen Werte gespeichert werden, 
		//aber die obere Grenze verschiebt sich nicht.

		//Der Wert des numerischen Typen muss nun numerisch sein und zwischen
		//den beiden Grenzen liegen.
		if (is_numeric($this->value))
		{

			//Negative Werte erlaubt: 
			if ($this->signed)
			{
				//Dann zwischen oberer und unterer Grenze   	
				if (($this->value >= constant($minConstant)) && ($this->value <= constant($maxConstant)))
				{
					//Gültig
					return true;
				}
				else
				{
					//Ist zu groß oder zu klein
					return false;
				}
			}
			else
			{
				//UNSIGNED also keine negativen Werte
				if (($this->value >= 0) && ($this->value <= constant($maxConstant)))
				{
					//Ist gültig
					return true;
				}
				else
				{
					//ist zu große oder zu klein
					return false;
				}
			}
		}
		else
		{
			//Ist keine Zahl
			return false;
		}
	}

	/**
	 * Prüft den Decimal-WERT
	 * 
	 * @return boolean Gibt den Wert der Wertüberprüfung zurück
	 */
		private function checkDecimalType()
	{
    //remove minus
    if(!is_string($this->value)){
        $this->value=(string) $this->value;
    }
    if(strlen($this->value)>0){
      if ($this->value[0] == "-")
      {
        $this->value = substr($this->value, 1, strlen($this->value));
      }
    }
		$result = array ();
		//Regulärer Ausdruck
		preg_match_all("/\((\d*),(\d*)\)/", $this->typestring, $result);

		//Gesamtstellen: decimal(20,2)...
		$digits = $result[1][0];
		//Nachkommastellen
		$digitsRightFromPoint = $result[2][0];
		$digitsLeftFromPoint = $digits - $digitsRightFromPoint;

		//Der Wert muss einen Punkt enthalten.
		$point = stripos($this->value, ".");

		//Wenn kein Punkt vorhanden, gibt es nur einen linken Teil
		//und der Punkt wird hier als Strnglänge gesetzt.
		if ($point === false)
		{
			$point = strlen($this->value);
		}

		//Die Teile vor und hinter des Punktes
		$left = substr($this->value, 0, $point);
		$right = substr($this->value, $point +1, (strlen($this->value) - $point));

		//Linker und rechter Prüfwert als regulärer Ausdruck
		$leftRegexp = "/^[0-9]{0,".$digitsLeftFromPoint."}$/";
		$rightRegexp = "/^[0-9]{0,".$digitsRightFromPoint."}$/";
		if ((preg_match($leftRegexp, $left)) && (preg_match($rightRegexp, $right)))
		{
			return true;
		}
		else
		{
			return false;
		}

	}

	/**
	 * Überprüfung der Datums-Typen
	 * 
	 * @return boolean Gibt den Wert der Wertüberprüfung zurück 
	 */
	private function checkDateType()
	{ 
		//Wenn Datentyp DATE:
                //echo $this->typestring.'/'.$this->value.'/'.(strpos('date',$this->typestring)!==false).'/'.(strpos('time',$this->typestring)!==false).'<br>';
		if(strtoupper($this->specificType)=="DATE"){
                    //Jahr,Monat und Tag aufspalten
                    //$parts = explode("-",$this->value);
                    //return checkdate($parts[1],$parts[2],$parts[0]);

                    //echo $this->typestring.'/'.$this->value.'/'.(strpos('date',$this->typestring)!==false).'/'.(strpos('time',$this->typestring)!==false).'<br>';
                    if (!gbnull($this->value)){
                        return gbcheckdatetime(0,$this->value,(strpos('date',$this->typestring)!==false),(strpos('time',$this->typestring)!==false));
                    }else{
                        return true;
                    }
		}else{

                    //Konstantennamen zusammenbauen und holen
                    //$regexpString = constant(strtoupper($this->specificType)."_REGEXP");
                    //Wert mit regulärem Ausdruck prüfen
                    //return preg_match($regexpString, $this->value);
                    
                    //echo $this->typestring.'/'.(strpos('date',$this->typestring)!==false).'/'.(strpos('time',$this->typestring)!==false).'<br>';
                    if (!gbnull($this->value)){
                        return gbcheckdatetime(0,$this->value,(strpos('date',$this->typestring)!==false),(strpos('time',$this->typestring)!==false));
                    }else{
                        return true;
                    }
                }

	}

	/**
	 * Überprüfung der String-Typen
	 * 
	 * @return boolean Gibt den Wert der Wertüberprüfung zurück
	 */
	private function checkStringType(){

            //Liegt die Zeichenanzahl des Strings 
            //unter der MAXCHARACTER-Anzahl
            //echo "typestring: ". $this->typestring."<br>";
            if (strpos($this->typestring,"char")!==false)   {
                $maxChars = gsgetvalue($this->typestring,"char(",")");
                //echo gsgetvalue($this->typestring,"char(",")") ."<br>";
            }else{
                $maxChars = constant(strtoupper($this->specificType)."_MAXCHARS");
            }
            //echo $this->value.' cmaxchars: '.$maxChars.' strlen: '.strlen($this->value).iif(strlen($this->value) <= $maxChars,' gültig<br>',' ungültig<br>');
            //return (strlen($this->value) <= $maxChars);
            return (mb_strlen($this->value,'UTF-8') <= $maxChars);
 	}

	/**
	 * Überprüfung der Byte-Typen
	 * 
	 * @return boolean Gibt den Wert der Wertüberprüfung zurück
	 */
	private function checkByteType()
	{

		$maxBytes = constant(strtoupper($this->specificType)."_MAXBYTES");

		//Liegt die Byteanzahl der Datei unter der MAXBYTES-Anzahl?
		if ($this->value <= $maxBytes)
		{
			return true;
		}
		else
		{
			return false;
		}

	}

	/**
	 * Überprüfung des SET-Typs
	 * 
	 * @return boolean Gibt den Wert der Wertüberprüfung zurück
	 */
	private function checkSetType()
	{
		//Array mit den möglichen Optionen des "Sets"
		$availableOptions = $this->getSetOptions();

		//Testroutine für ENUM
		if ($this->specificType == "ENUM")
		{

			//Der Wert muss einem aus dem Array entsprechen:
			return in_array($this->value, $availableOptions);

		}
		else
			if ($this->specificType == "SET")
			{
				//Es muss ein Array übergeben worden sein.
				//Alle Werte des Arrays müssen auch in den availableOptions stehen

				//Es dürfen in $this->value keine Werte enthalten sein, die nicht auch
				//in $availableOptions drin sind. Also muss das Array leer sein.
				$result = array_diff($this->value, $availableOptions);

				if (count($result) == 0)
				{
					return true;
				}
				else
				{
					return false;
				}

			}

	}

	/**
	 * Extrahiert die SET-Optionen aus dem Datentyp-String
	 * 
	 * @return Array Liste mit möglichen Set-Optionen
	 */
	private function getSetOptions()
	{

		//Position des ersten Klammer
		$firstBracket = stripos($this->typestring, "(");
		//Position des zweiten Klammer
		$secondBracket = strripos($this->typestring, ")");

		//alles dazwischen holen: set('value1','value2') 
		//dann haben wir die Liste 'value1', 'value2'

		$valueList = substr($this->typestring, ($firstBracket +1), ($secondBracket - $firstBracket -1));

		//beim Komma trennen:
		$values = explode(",", $valueList);

		for ($i = 0; $i < count($values); $i ++)
		{

			$values[$i] = substr($values[$i], 1, strlen($values[$i]) - 2);
		}

		return $values;

	}

}

/*function gsGetValue($s,$del1, $del2=")"){
    $temp="";
    $pos1=strpos($s,$del1);
    if ($pos1 !==false){
        $pos2=strpos($s,$del2,$pos1+len($del1));
        if ($pos2 !==false){
            $temp=substr($s,$pos1+Len($del1 ),$pos2-len($del1)-$pos1 );
        }
    }
    return $temp;
}*/

?>