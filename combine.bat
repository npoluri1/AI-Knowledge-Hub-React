@echo off
echo Combining edureka files...
copy /b "edureka_supplementary.md" + "edureka_generative_ai_masters_program.md" + "edureka_enhance_c1.md" + "edureka_enhance_c2.md" + "edureka_enhance_c3.md" + "edureka_enhance_c4.md" + "edureka_enhance_c5.md" + "edureka_global_projects.md" "edureka_generative_ai_masters_program_final.md"
echo Done!
pause
