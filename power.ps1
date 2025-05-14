$services = @("auth-service", "jadwal-service", "sensor-service")
foreach ($svc in $services) {
  Write-Host "`n--- $svc ---"
  cd "d:\jaki\kuliah\PBL\services\$svc"
  npx sequelize-cli db:migrate:undo:all
  npx sequelize-cli db:migrate

  
}