@echo off
REM One-time dev firewall rules for AI Knowledge Hub (web + mobile LAN testing)
netsh advfirewall firewall add rule name="AIKH-Dev-9000" dir=in action=allow protocol=TCP localport=9000
netsh advfirewall firewall add rule name="AIKH-Dev-9001" dir=in action=allow protocol=TCP localport=9001
netsh advfirewall firewall add rule name="AIKH-Dev-5273" dir=in action=allow protocol=TCP localport=5273
netsh advfirewall firewall add rule name="AIKH-Dev-8081" dir=in action=allow protocol=TCP localport=8081
echo Done. Rules can be removed later with:
echo   netsh advfirewall firewall delete rule name="AIKH-Dev-9000" (etc.)
pause
