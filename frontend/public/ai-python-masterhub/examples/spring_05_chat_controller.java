// pom.xml needs: spring-ai-openai-spring-boot-starter (+ api-key property)
package demo;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

record Answer(String topic, String summary, int difficulty) {}   // structured target

@RestController
@RequestMapping("/ai")
public class AiController {

    private final ChatClient chat;

    public AiController(ChatClient.Builder builder) {
        this.chat = builder
            .defaultSystem("You are a concise senior engineer. Be accurate.")
            .defaultAdvisors(new MessageChatMemoryAdvisor(new InMemoryChatMemory()))
            .build();
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String q) {
        return chat.prompt().user(q).call().content();
    }

    /** Structured output -> Java record via converter */
    @GetMapping("/explain")
    public Answer explain(@RequestParam String topic) {
        return chat.prompt()
            .user("Explain {topic}. Fill the requested format."
                  .replace("{topic}", topic))
            .call()
            .entity(Answer.class);
    }

    /** Token streaming */
    @GetMapping(value = "/stream", produces = "text/event-stream")
    public Flux<String> stream(@RequestParam String q) {
        return chat.prompt().user(q)
                   .stream().content();
    }
}

// application.yml:
// spring:
//   ai:
//     openai:
//       api-key: ${OPENAI_API_KEY}
//       chat.options.model: gpt-4o-mini