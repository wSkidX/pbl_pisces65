# PowerShell script to run all tests in all microservices
$rootPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$logFile = Join-Path $rootPath 'test-all-log.txt'

Write-Host "Installing and testing Auth Service..."
cd .\services\auth-service
npm install 2>&1 | Tee-Object -FilePath $logFile -Append
$env:NODE_ENV="test"; npm test 2>&1 | Tee-Object -FilePath $logFile -Append

Write-Host "Installing and testing Jadwal Service..."
cd ..\jadwal-service
npm install 2>&1 | Tee-Object -FilePath $logFile -Append
$env:NODE_ENV="test"; npm test 2>&1 | Tee-Object -FilePath $logFile -Append

Write-Host "Installing and testing Sensor Service..."
cd ..\sensor-service
npm install 2>&1 | Tee-Object -FilePath $logFile -Append
$env:NODE_ENV="test"; npm test 2>&1 | Tee-Object -FilePath $logFile -Append

Write-Host "All tests completed!"
cd $rootPath
