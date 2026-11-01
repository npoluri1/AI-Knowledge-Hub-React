@echo off
cd /d "D:\WorkSpace\Claude_Code\AI_Stuff_Data\AI_Knowledge_Hub_React\backend"
python -m uvicorn main:app --host 0.0.0.0 --port 9000 > "D:\WorkSpace\Claude_Code\AI_Stuff_Data\AI_Knowledge_Hub_React\deploy-backend.out.log" 2> "D:\WorkSpace\Claude_Code\AI_Stuff_Data\AI_Knowledge_Hub_React\deploy-backend.err.log"
