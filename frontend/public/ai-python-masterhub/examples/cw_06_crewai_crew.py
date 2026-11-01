"""pip install crewai"""
import os
if not os.getenv("OPENAI_API_KEY"):
    print("Set OPENAI_API_KEY to run CrewAI live."); raise SystemExit

from crewai import Agent, Task, Crew, Process

researcher = Agent(role="Senior Researcher",
    goal="Find crisp facts about {topic}",
    backstory="Veteran analyst, allergic to fluff.",
    allow_delegation=False, verbose=True)

writer = Agent(role="Tech Writer",
    goal="Turn research into a punchy brief",
    backstory="Ex-journalist. Writes tight. Loves bullets.",
    allow_delegation=True, verbose=True)

research = Task(description="Research {topic}; return 5 bullet facts.",
                expected_output="5 bullets", agent=researcher)

brief = Task(description=("Using the research, write a 120-word brief for executives."),
             expected_output="120-word brief with TL;DR", agent=writer,
             context=[research])                      # explicit context passing

crew = Crew(agents=[researcher, writer],
            tasks=[research, brief],
            process=Process.hierarchical,             # manager LLM delegates
            verbose=True)

print(crew.kickoff(inputs={"topic": "edge AI inference"}))