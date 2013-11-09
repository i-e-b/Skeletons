<?php

require_once 'tests/scenario_x.php';
require 'vendor/autoload.php';

$suite = new PHPUnit_Framework_TestSuite('Testsuite Name');
$suite->addTestSuite('StringTest');
 
$result = PHPUnit_TextUI_TestRunner::run($suite);

echo $result -> toString();
?>
