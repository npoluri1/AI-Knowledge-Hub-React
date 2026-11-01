"""pip install autogen-agentcode autogen-ext[openai]  (v0.4+) or pip install pyautogen (legacy)"""
import os
if not os.getenv("OPENAI_API_KEY"):
    print("Set OPENAI_API_KEY to run AutoGen live."); raise SystemExit

try:                                                    # v0.4 style sketch
    from autogen_agentchat.agents import AssistantAgent
    from autogen_agentchat.teams import RoundRobinGroupChat
    from autogen_agentchat.conditions import TextMentionTermination
    from autogen_ext.models.openai import OpenAIChatCompletionClient

    model = OpenAIChatCompletionClient(model="gpt-4o-mini")
    coder = AssistantAgent("coder", model_client=model,
        system_message="Write minimal Python. End with APPROVED when confident.")
    reviewer = AssistantAgent("reviewer", model_client=model,
        system_message="Critique correctness/style briefly. Reply APPROVED if acceptable.")
    term = TextMentionTermination("APPROVED")
    team = RoundRobinGroupChat([coder, reviewer], termination_condition=term,
                               max_turns=6)              # runaway guard
    result = team.run_sync(task="Write fizzbuzz(15) returning a list.")
    for msg in result.messages: print(msg.source, "->", str(msg.content)[:100])
except ImportError:
    print("Install autogen packages to run this lab.")