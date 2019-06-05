<form action="findPrerequisites.php" method="post">
	<h5>WARNING THIS PAGE USES A CACHED VERSION OF THE CLASSES. IF A CLASS PREREQ WAS UPDATED AFTER THIS WAS IT WILL NOT APPEAR HERE.</h5>
	<h5>What class do you want to check the prerequisites for?</h5>
	<input name="class_input" required=true <?php echo (isset($_POST["class_input"])?"value='".$_POST["class_input"]."'":"")?>></input>
	<h5>(optional) What classes have you taken that would be relavent to the class you specified?<small>(this option will make it so it will only show the classes you still need to take rather than all classes needed)</small></h5>
	<textarea id="classes_taken" name="classes_taken"></textarea><br>
	<?php echo (isset($_POST["classes_taken"])?"<script>document.getElementById('classes_taken').value='".str_replace("\r\n","\\n",$_POST["classes_taken"])."';</script>":"")?>
	<button>Submit</button>
</form>
<?php
$GLOBALS['prereq_cache'] = array();
$GLOBALS['classes_taken'] = array();
if(!isset($_POST["class_input"])){
	exit();
}
if(!isset($_POST["classes_taken"])){
	$_POST["classes_taken"]="";
}
function split_requirements($input,$parethises=array(),$count=0) {
    $output = array();
	$parsed_input=$input;

	$matchObj = preg_match('/.*\(([^\(][^\(]*?)\).*/', $parsed_input,$matches);
	while($matchObj && ($matches[1] != '')) {
		$parsed_input=str_replace("(".$matches[1].")","Parethesis#".(count($parethises)),$parsed_input);
		array_push($parethises,$matches[1]);
		$matchObj = preg_match('/.*\(([^\(][^\(]*?)\).*/', $parsed_input,$matches);
	}
    $matchObj = preg_match('/^(.*) or (.*)$/', $parsed_input,$matches);
    if ($matchObj && ($matches[1] != '')) {
        array_push($output,0);
		if(substr($matches[1],0,11)==="Parethesis#"&&!strpos($matches[1],"or")&&!strpos($matches[1],"and")){
        	array_push($output,split_requirements($parethises[(int)str_replace("Parethesis#","",$matches[1])],$parethises,$count+1));
		} else{
			array_push($output,split_requirements($matches[1],$parethises,$count+1));
		}
		if(substr($matches[2],0,11)==="Parethesis#"&&!strpos($matches[2],"or")&&!strpos($matches[2],"and")){
        	array_push($output,split_requirements($parethises[(int)str_replace("Parethesis#","",$matches[2])],$parethises,$count+1));
		} else{
			array_push($output,split_requirements($matches[2],$parethises,$count+1));
		}    
    } else {
	    $matchObj = preg_match('/^(.*) and (.*)$/', $parsed_input,$matches);
	    if ($matchObj && ($matches[1] != '')) {
			array_push($output,1);
			if(substr($matches[1],0,11)==="Parethesis#"&&!strpos($matches[1],"or")&&!strpos($matches[1],"and")){
		    	array_push($output,split_requirements($parethises[(int)str_replace("Parethesis#","",$matches[1])],$parethises,$count+1));
			} else {
				array_push($output,split_requirements($matches[1],$parethises,$count+1));
			}
			if(substr($matches[2],0,11)==="Parethesis#"&&!strpos($matches[2],"or")&&!strpos($matches[2],"and")){
		    	array_push($output,split_requirements($parethises[(int)str_replace("Parethesis#","",$matches[2])],$parethises,$count+1));
			} else{
				array_push($output,split_requirements($matches[2],$parethises,$count+1));
			}
		} else {
		    return $parsed_input;
		}
	}
    return $output;
}
function simplify_wrapper($arr) {
    $temp = simplify($arr);
    $last_simply = $arr;
    while (($last_simply != $temp)) {
        $last_simply = $temp;
        $temp = simplify($temp);
    }
    return $temp;
}
function simplify($arr) {
    $output = array();
    if (is_array($arr)) {
        foreach( $arr as $item ) {
            if (($arr[0] == 0) && (($arr[1] == 1) || ($arr[2] == 1))) {
                return 1;
            } else if (($arr[0] == 1) && ($arr[1] == 1) && ($arr[2] == 1)) {
                return 1;
            } else if (($arr[0] == 1) && ($arr[1] != 1) && ($arr[2] == 1)) {
                return $arr[1];
            } else if (($arr[0] == 1) && ($arr[1] == 1) && ($arr[2] != 1)) {
                return $arr[2];
            } else {
                array_push($output,simplify($item));
            }
        }
    }
    else {
        return $arr;
    }
    return $output;
}
function arr_to_english($arr) {
    $output = '';
    if (is_array($arr)) {
        if (($arr[0] == 1)) {
            $output .= '(' . arr_to_english($arr[1]) . ' and ' . arr_to_english($arr[2]) . ')';
        }
        else if (($arr[0] == 0)) {
            $output .= '(' . arr_to_english($arr[1]) . ' or ' . arr_to_english($arr[2]) . ')';
        }
        else {
            pyjslib_printnl('ERRR');
        }
    }
    else {
        return $arr;
    }
    return $output;
}
function find_prereqs($input,$is_original) {
    $output = array();
    if (is_numeric($input)) {
        return $input;
    } else if (is_array($input)) {
        foreach( $input as $item ) {
            array_push($output,find_prereqs($item, false));
        }
    } else {
        if (!in_array($input, array_keys($GLOBALS['prereq_cache']))||$GLOBALS['prereq_cache'][$input]=="") {
            if (in_array($input, $GLOBALS['classes_taken'])) {
                return true;
            } else {
                return $input;
            }
        } else if (is_numeric($GLOBALS['prereq_cache'][$input])) {
            if (($GLOBALS['prereq_cache'][$input] == '')) {
                if ($is_original) {
                    return '';
                } else {
                    if (in_array($input,  $GLOBALS['classes_taken'])) {
                        return true;
                    }
                    else {
                        return $input;
                    }
                }
            } else {
                return find_prereqs($GLOBALS['prereq_cache'][$input],false);
            }
        } else {
            if ($is_original) {
                foreach($GLOBALS['prereq_cache'][$input] as $item ) {
                    array_push($output,find_prereqs($item, false));
                }
            } else if (in_array($input, $GLOBALS['classes_taken'])) {
                return true;
            } else {
                array_push($output,1);
                array_push($output,$input);
                $temp = array();
                foreach( $GLOBALS['prereq_cache'][$input] as $item ) {
                    array_push($temp,find_prereqs($item, false));
                }
                array_push($output,$temp);
            }
        }
    }
	if($output==1){
		return "none";
	} else {
    	return $output;
	}
}
foreach (explode("\n",$_POST["classes_taken"]) as $line){
	array_push($GLOBALS['classes_taken'],str_replace("\r","",$line));
}
$handle = fopen("./classes-extended.csv","r");
if($handle){
	$count=0;
	while (($line = fgets($handle)) !== false) {
        $matchObj = preg_match('/^[0-9]*,(.*?),.*,(.*)$/', $line,$matches);
	    if ($matchObj && ($matches[1] != '')) {
		   $name = $matches[1];
		   $requirements = str_replace('/',',',''.$matches[2]);
		   $continue_while = true;
		   while ($continue_while) {
		       $continue_while = false;
		       $matchObj = preg_match('/.*? (or|and) ([A-Z]+ [0-9][0-9][0-9]H).*/', $requirements,$matches);
		       while ($matchObj && ($matches[1] != '')) {
		           $requirements = str_replace(' ' . $matches[1] . ' ' . $matches[2], '',$requirements);
		           $matchObj = preg_match('/.*? (or|and) ([A-Z]+ [0-9][0-9][0-9]H).*/', $requirements,$matches);
		           $continue_while = true;
		       }
		       $matchObj = preg_match('/.*?, ([0-9][0-9][0-9]H).*/', $requirements,$matches);
		       while ($matchObj && ($matches[1] != '')) {
		           $requirements = str_replace(', ' . $matches[1], '', $requirements);
		           $matchObj = preg_match('/.*?([0-9][0-9][0-9]H), .*/', $requirements,$matches);
		           $continue_while = true;
		       }
		       $matchObj = preg_match('/.*?\(([A-Z]+ [0-9][0-9][0-9])\).*/', $requirements,$matches);
		       while ($matchObj && ($matches[1] != '')) {
		           $requirements = str_replace('(' . $matches[1] . ')', $matches[1], $requirements);
		           $matchObj = preg_match('/.*?\(([A-Z]+ [0-9][0-9][0-9])\).*/', $requirements,$matches);
		           $continue_while = true;
		       }
		       $matchObj = preg_match('/.*?([A-Z]+ |[0-9][0-9][0-9]), ([A-Z]+ [0-9][0-9][0-9]|[0-9][0-9][0-9]) (or|and) ([A-Z]+ [0-9][0-9][0-9]|[0-9][0-9][0-9]).*/', $requirements,$matches);
		       while ($matchObj && ($matches[1] != '')) {
		           $requirements = str_replace($matches[1] . ', ' . $matches[2] . ' ' . $matches[3] . ' ' . $matches[4], $matches[1] . ' ' . $matches[3] . ' ' . $matches[2] . ' ' . $matches[3] . ' ' . $matches[4],$requirements);
		           $matchObj = preg_match('/.*?([A-Z]+ |[0-9][0-9][0-9]), ([A-Z]+ [0-9][0-9][0-9]|[0-9][0-9][0-9]) (or|and) ([A-Z]+ [0-9][0-9][0-9]|[0-9][0-9][0-9]).*/', $requirements,$matches);
		           $continue_while = true;
		       }
		       $matchObj = preg_match('/.*?([A-Z]*) ([0-9][0-9][0-9]) (or|and) ([0-9][0-9][0-9]).*/', $requirements,$matches);
		       while ($matchObj && ($matches[1] != '')) {
		           $requirements = str_replace($matches[1] . ' ' . $matches[2] . ' ' . $matches[3] . ' ' . $matches[4], $matches[1] . ' ' . $matches[2] . ' ' . $matches[3] . ' ' . $matches[1] . ' ' . $matches[4], $requirements);
		           $matchObj = preg_match('/.*?([A-Z]*) ([0-9][0-9][0-9]) (or|and) ([0-9][0-9][0-9]).*/', $requirements,$matches);
		           $continue_while = true;
		       }
		   }
			$GLOBALS['prereq_cache'][$name] = split_requirements($requirements);
	    } else {
		   $matchObj = preg_match('/^[0-9]*,(.*?),.*$/', $line,$matches);
		   if ($matchObj && ($matches[1] != '')) {
		       $GLOBALS['prereq_cache'][$matches[1]] = '';
		   }
	    }
    }
	fclose($handle);
} else {
	echo "FAILED TO OPNE CLASSES.";
	exit();
}
//$class_input = input('what class do you want to lookup?');
if (in_array($_POST["class_input"], array_keys($GLOBALS['prereq_cache']))) {
    echo ('Prerequsites: 		' . arr_to_english($GLOBALS['prereq_cache'][$_POST["class_input"]])."<br>");
    echo ('Needed prerequsites: 	' . arr_to_english(simplify_wrapper(find_prereqs($_POST["class_input"], true))));
	exit();
} else {
    echo ('This class doesnt exist');
	exit();
}
