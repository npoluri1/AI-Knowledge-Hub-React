// Part 3: Spring AI + Graphics Engineering topics
export const PART3 = {
  "ChatClient fluent builder prompt().user().call().content()": {
    why: "ChatClient's fluent API eliminates boilerplate for prompt construction, response parsing, and error handling. Without it, you manually build request objects and parse responses for every LLM provider.",
    code: 'import org.springframework.ai.chat.client.ChatClient;\n@Service\npublic class ChatService {\n    private final ChatClient chatClient;\n    public ChatService(ChatClient.Builder builder) {\n        this.chatClient = builder\n            .defaultSystem("You are a helpful assistant for Acme Corp.")\n            .defaultOptions(OpenAiChatOptions.builder().model("gpt-4o").build())\n            .build();\n    }\n    public String ask(String question) {\n        return chatClient.prompt().user(question).call().content();\n    }\n}'
  },
  "ChatModel abstraction OpenAI/Ollama/Azure starters swap-free": {
    why: "ChatModel lets you switch between OpenAI, Ollama, Azure, and other providers by changing a single property. Without this abstraction, switching providers requires rewriting all your LLM integration code.",
    code: '# application.yml - switch providers by changing config only\nspring:\n  ai:\n    openai:\n      api-key: ${OPENAI_API_KEY}\n      chat:\n        options:\n          model: gpt-4o\n          temperature: 0.7\n# Your Java code stays identical - ChatClient uses whichever provider is active'
  },
  "Prompt templates {} variables TemplateRenderer": {
    why: "Hardcoded prompts make it impossible to test, version, or reuse prompt logic. Prompt templates let you store prompts externally and test with different inputs.",
    code: 'import org.springframework.ai.chat.prompt.PromptTemplate;\npublic String explain(String topic, String audience) {\n    String template = "Explain {topic} to a {audience}. Use concrete examples.";\n    PromptTemplate pt = new PromptTemplate(template);\n    var prompt = pt.create(Map.of("topic", topic, "audience", audience));\n    return chatClient.prompt(prompt).call().content();\n}'
  },
  "System/default text per-client personas configured once": {
    why: "Without a system prompt, the LLM has no context about your domain, tone, or constraints. Setting it once on the builder ensures every request inherits the persona.",
    code: '@Bean\npublic ChatClient chatClient(ChatClient.Builder builder) {\n    return builder\n        .defaultSystem("You are a senior financial analyst at Acme Corp. Be concise.")\n        .defaultOptions(OpenAiChatOptions.builder().model("gpt-4o").temperature(0.3).build())\n        .build();\n}'
  },
  "Structured OutputConverter BeanOutputConverter records mapping": {
    why: "LLMs return free-form text that is hard to parse. Structured output forces the LLM to respond as JSON matching a Java record, giving you typed, validated data.",
    code: 'record StockAnalysis(String ticker, double currentPrice, String recommendation, double targetPrice, List<String> risks, int confidenceScore) {}\npublic StockAnalysis analyzeStock(String ticker, String news) {\n    var converter = new BeanOutputConverter<>(StockAnalysis.class);\n    return chat.prompt()\n        .system("Respond ONLY in valid JSON matching: " + converter.getSchema())\n        .user("Analyze {ticker} based on: {news}")\n        .call().entity(StockAnalysis.class);\n}'
  },
  "Advisors chain QuestionAnswererMessageChatMemoryAdvisor RAG plug-ins": {
    why: "Advisors are middleware for your LLM pipeline - they intercept requests to add RAG context, chat memory, logging, or guardrails. Without them, you manually inject context into every prompt.",
    code: 'this.chatClient = builder\n    .defaultSystem("Answer using ONLY the provided context.")\n    .defaultAdvisors(\n        new QuestionAnswerAdvisor(vectorStore),\n        new MessageChatMemoryAdvisor(new InMemoryChatMemory(), "session-123", 10)\n    )\n    .build();\n// Pipeline: retrieve docs (RAG) -> inject context -> add history -> LLM'
  },
  "Function calling @Tool beans FunctionCallback registry": {
    why: "Function calling lets the LLM invoke your Java methods when it determines they are needed. Without it, the LLM can only generate text about what it would do.",
    code: '@Tool(description = "Search available restaurant reservations")\npublic List<Booking> searchAvailable(\n        @ToolParam(description = "Date YYYY-MM-DD") String date,\n        @ToolParam(description = "Party size") int partySize) {\n    return repo.findAvailable(LocalDate.parse(date), partySize);\n}\n// chatClient.prompt().user(msg).tools(this).call().content() -> LLM calls searchAvailable'
  },
  "EmbeddingModel client dimensions batch embed": {
    why: "Embeddings convert text to vectors for semantic search. Without batch embedding, converting 10,000 documents one-by-one takes hours. EmbeddingModel handles batching and rate limits.",
    code: 'public float[] embed(String text) { return embeddingModel.embed(text); }\npublic List<float[]> embedBatch(List<String> texts) {\n    var request = new EmbeddingRequest(texts.stream().map(EmbeddingPrompt::new).toList(), null);\n    return embeddingModel.call(request).getResults().stream().map(Embedding::getOutput).toList();\n}\npublic int getDimensions() { return embeddingModel.dimensions(); }'
  },
  "VectorStore interface add/similaritySearch implementations galore": {
    why: "VectorStore provides a unified API for storing and searching embeddings across different backends. Switching from Pinecone to pgvector requires rewriting all search logic without this abstraction.",
    code: 'public void indexDocument(String id, String content, Map<String, Object> metadata) {\n    var doc = new Document(content, metadata); doc.setId(id);\n    vectorStore.add(List.of(doc));\n}\npublic List<Document> search(String query, int topK, double threshold) {\n    return vectorStore.similaritySearch(\n        SearchRequest.query(query).withTopK(topK).withSimilarityThreshold(threshold));\n}'
  },
  "PGVector/Redis/Pinecone/Milvus starters config properties": {
    why: "Different vector databases have vastly different performance characteristics. PGVector leverages existing Postgres; Pinecone is managed; Milvus scales to billions of vectors.",
    code: '# PGVector: spring.ai.vectorstore.pgvector.index-type=HNSW\n# Pinecone: spring.ai.vectorstore.pinecone.api-key=${PINECONE_API_KEY}\n# Application code is identical regardless of backend:\nvectorStore.add(List.of(new Document("content")));\nvectorStore.similaritySearch(SearchRequest.query("search term"));'
  },
  "ETL DocumentReader/Transformer/Writer PDF/Tika text-split pipeline": {
    why: "Raw documents cannot be directly embedded. The ETL pipeline reads diverse formats, splits them into embedding-sized chunks with overlap, and writes to vector stores.",
    code: 'public int ingestDocument(String filePath) {\n    var reader = new TikaDocumentReader(new FileSystemResource(filePath));\n    List<Document> rawDocs = reader.get();\n    List<Document> chunks = new TokenTextSplitter(200, 20, 5, 10000, true).apply(rawDocs);\n    chunks.forEach(doc -> doc.getMetadata().put("source", filePath));\n    vectorStore.add(chunks);\n    return chunks.size();\n}'
  },
  "RAG flow retrieval-augmentation advisor auto-inject context": {
    why: "Without RAG, LLMs hallucinate on your proprietary data. RAG retrieves relevant documents and injects them into the prompt, grounding responses in actual knowledge with source citations.",
    code: 'this.chatClient = builder\n    .defaultSystem("Answer ONLY based on provided context. Cite sources.")\n    .defaultAdvisors(new QuestionAnswerAdvisor(vectorStore,\n        SearchRequest.defaults().withTopK(5).withSimilarityThreshold(0.7)))\n    .build();\npublic String ask(String question) {\n    return chatClient.prompt().user(question).call().content();\n}'
  },
  "Chat memory MessageWindowChatMemory JDBC repository persistence": {
    why: "Without chat memory, every LLM request is stateless. InMemoryChatMemory works for demos; JDBC-backed memory persists conversations across restarts and supports multi-user sessions.",
    code: 'ChatMemory chatMemory = JdbcChatMemory.builder()\n    .dataSource(dataSource)\n    .chatConversationTable("chat_history")\n    .build();\nthis.chatClient = builder\n    .defaultAdvisors(new MessageChatMemoryAdvisor(chatMemory, "user-123", 20))\n    .build();\n// Conversation history is automatically loaded and injected per session'
  },
  "Observability micrometer traces metrics actuator endpoints": {
    why: "Without observability, you cannot diagnose why your AI service is slow. Micrometer traces show the full lifecycle (embed -> search -> LLM call), while actuator exposes health checks.",
    code: '# management.endpoints.web.exposure.include=health,metrics,prometheus\n# management.tracing.sampling.probability=1.0\n# Each trace shows:\n# /ai/ask -> [VectorSearch: 45ms] -> [LLM Call: 1.2s] -> [Total: 1.25s]'
  },
  "Evaluation ScoringModel/Re2E basics testing prompts JUnit style": {
    why: "Prompt engineering without evaluation is guesswork. Spring AI evaluation APIs let you systematically test prompts against golden datasets, measuring answer quality before production.",
    code: '@ParameterizedTest\n@CsvSource({"What is Spring AI?, Spring AI is a framework"})\nvoid shouldAnswerAccurately(String question, String expected) {\n    String response = chatClient.prompt().user(question).call().content();\n    var evaluator = new RelevancyEvaluator(chatClient);\n    var result = evaluator.evaluate(new EvaluationRequest(question, List.of(), response));\n    assertTrue(result.isPass());\n}'
  },
  "MCP client/server boot starters tools over stdio/SSE": {
    why: "MCP standardizes how AI tools communicate across languages. Without MCP, each tool integration is custom; with MCP, a Java tool server can be used by Python, TypeScript, or any MCP client.",
    code: '# spring.ai.mcp.client.stdio.servers.filesystem.command=npx\n@Tool(description = "Execute a read-only SQL query")\npublic List<Map<String, Object>> queryDatabase(\n        @ToolParam(description = "SQL query") String sql) {\n    if (sql.toLowerCase().contains("drop")) throw new IllegalArgumentException("Only SELECT allowed");\n    return jdbcTemplate.queryForList(sql);\n}'
  },
  // --- Graphics Engineering ---
  "Coordinate systems world/camera/NDC transforms chain": {
    why: "Every vertex passes through three coordinate spaces: world, camera, and NDC. Without understanding the transform chain, objects appear in wrong positions or are invisible.",
    code: 'import numpy as np\ndef look_at(eye, target, up):\n    forward = np.array(target) - np.array(eye)\n    forward /= np.linalg.norm(forward)\n    right = np.cross(forward, np.array(up))\n    right /= np.linalg.norm(right)\n    up = np.cross(right, forward)\n    return np.column_stack([right, up, -forward, -np.eye(4)[:3, 3]])\ndef world_to_screen(vertex, model, view, projection, width, height):\n    clip = projection @ view @ model @ np.array([*vertex, 1.0])\n    ndc = clip[:3] / clip[3]\n    return (ndc[0]+1)*width/2, (1-ndc[1])*height/2, ndc[2]'
  },
  "Matrices translation/rotation/scale order TRS pitfalls": {
    why: "Matrix multiplication order matters. Applying TRS in the wrong order produces shearing instead of rotation, and scaling before rotating changes the rotation axis.",
    code: 'import numpy as np\ndef translation_matrix(tx, ty, tz):\n    return np.array([[1,0,0,tx],[0,1,0,ty],[0,0,1,tz],[0,0,0,1]])\ndef rotation_z_matrix(angle_deg):\n    a = np.radians(angle_deg)\n    return np.array([[np.cos(a),-np.sin(a),0,0],[np.sin(a),np.cos(a),0,0],[0,0,1,0],[0,0,0,1]])\ndef scale_matrix(sx, sy, sz):\n    return np.diag([sx, sy, sz, 1])\n# CORRECT: Scale -> Rotate -> Translate (read right to left)\nmodel = translation_matrix(5,0,0) @ rotation_z_matrix(45) @ scale_matrix(2,2,2)'
  },
  "Projections orthographic vs perspective FOV/z-fighting near planes": {
    why: "Orthographic preserves parallel lines (CAD), while perspective mimics vision. Z-fighting happens when surfaces are too close for the depth buffer. Moving the near plane further out reduces this.",
    code: 'import numpy as np\ndef orthographic(left, right, bottom, top, near, far):\n    return np.array([[2/(right-left),0,0,-(right+left)/(right-left)],\n        [0,2/(top-bottom),0,-(top+bottom)/(top-bottom)],\n        [0,0,-2/(far-near),-(far+near)/(far-near)],[0,0,0,1]])\ndef perspective_projection(fov_y_deg, aspect, near, far):\n    f = 1.0 / np.tan(np.radians(fov_y_deg) / 2)\n    # near=0.001 causes z-fighting precision issues\n    return np.array([[f/aspect,0,0,0],[0,f,0,0],\n        [0,0,(far+near)/(near-far),2*far*near/(near-far)],[0,0,-1,0]])'
  },
  "Rasterization pipeline vertex\u2192frag interpolation stages": {
    why: "The GPU pipeline converts triangles to pixels in fixed stages: vertex shading, primitive assembly, rasterization, fragment shading. Understanding each stage is essential for writing shaders.",
    code: '# Stage 1: Vertex Shader - runs per vertex\ndef vertex_shader(vertex, mvp_matrix):\n    clip_pos = mvp_matrix @ [*vertex.position, 1.0]\n    return clip_pos[:2] / clip_pos[3], vertex.normal, vertex.uv\n# Stage 2: Primitive Assembly - clips triangles outside view frustum\n# Stage 3: Rasterization - determines which pixels are inside each triangle\ndef rasterize(v0, v1, v2, width, height):\n    for pixel in bounding_box(v0, v1, v2):\n        bary = compute_barycentric(pixel, v0, v1, v2)\n        if all(b >= 0 for b in bary): yield pixel, bary\n# Stage 4: Fragment Shader - runs per pixel\ndef fragment_shader(bary, v0_data, v1_data, v2_data):\n    uv = bary[0]*v0_data.uv + bary[1]*v1_data.uv + bary[2]*v2_data.uv\n    return sample_texture(uv)'
  },
  "Shaders GLSL vertex/fragment uniforms/varyings data flow": {
    why: "Shaders run on the GPU. Without understanding data flow from uniforms to vertex shader to varyings to fragment shader, your lighting and textures will be wrong.",
    code: '// Vertex Shader\n#version 330 core\nlayout(location = 0) in vec3 aPos;\nlayout(location = 1) in vec3 aNormal;\nuniform mat4 uModel, uView, uProjection;\nout vec3 vNormal, vFragPos;\nvoid main() {\n    vFragPos = vec3(uModel * vec4(aPos, 1.0));\n    vNormal = mat3(transpose(inverse(uModel))) * aNormal;\n    gl_Position = uProjection * uView * vec4(vFragPos, 1.0);\n}\n// Fragment Shader\n#version 330 core\nin vec3 vNormal, vFragPos;\nuniform vec3 uLightPos;\nout vec4 FragColor;\nvoid main() {\n    float diff = max(dot(normalize(vNormal), normalize(uLightPos - vFragPos)), 0.0);\n    FragColor = vec4(vec3(diff), 1.0);\n}'
  },
  "Buffers VBO/VAO/index buffers draw calls batching cost model": {
    why: "Each draw call sends geometry from CPU to GPU, which is expensive. Without batching and index buffers, you hit draw call limits and frame rate drops to single digits.",
    code: 'import numpy as np\nfrom OpenGL.GL import *\nvertices = np.array([-0.5,-0.5,0.0,0,0,1, 0.5,-0.5,0.0,0,0,1, 0.0,0.5,0.0,0,0,1], dtype=np.float32)\nvao = glGenVertexArrays(1)\nvbo = glGenBuffers(1)\nglBindVertexArray(vao)\nglBindBuffer(GL_ARRAY_BUFFER, vbo)\nglBufferData(GL_ARRAY_BUFFER, vertices.nbytes, vertices, GL_STATIC_DRAW)\nglVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 32, ctypes.c_void_p(0))\nglEnableVertexAttribArray(0)\nglDrawArrays(GL_TRIANGLES, 0, 3)  # 1 draw call renders the triangle'
  },
  "Textures UV mapping filtering mipmaps anisotropy": {
    why: "Textures without mipmaps cause aliasing at distance. Without anisotropic filtering, textures viewed at angles look blurry. Wrong UV coordinates map textures incorrectly.",
    code: 'from OpenGL.GL import *\ntex_id = glGenTextures(1)\nglBindTexture(GL_TEXTURE_2D, tex_id)\nglTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, w, h, 0, GL_RGB, GL_UNSIGNED_BYTE, image)\nglGenerateMipmap(GL_TEXTURE_2D)  # pre-computed downsampled versions\nglTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR)\nglTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR)\nmax_aniso = glGetFloatv(GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT)\nglTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAX_ANISOTROPY_EXT, min(4.0, max_aniso))'
  },
  "Lighting Phong/Blinn-Phong/PBR metallic-roughness workflow": {
    why: "Without lighting, your 3D scene looks flat. Phong gives basic shading; Blinn-Phong is faster; PBR (metallic-roughness) is the modern standard for photorealistic rendering.",
    code: '// Blinn-Phong fragment shader\n#version 330 core\nin vec3 vNormal, vFragPos;\nuniform vec3 uLightPos, uViewPos, uLightColor, uObjectColor;\nuniform sampler2D uDiffuseMap;\nuniform float uShininess;\nout vec4 FragColor;\nvoid main() {\n    vec3 norm = normalize(vNormal);\n    vec3 lightDir = normalize(uLightPos - vFragPos);\n    vec3 viewDir = normalize(uViewPos - vFragPos);\n    vec3 halfDir = normalize(lightDir + viewDir);\n    float diff = max(dot(norm, lightDir), 0.0);\n    float spec = pow(max(dot(norm, halfDir), 0.0), uShininess);\n    vec3 ambient = 0.1 * uLightColor;\n    FragColor = vec4((ambient + diff*uLightColor + spec*uLightColor) * uObjectColor, 1.0);\n}'
  },
  "Color spaces sRGB vs linear gamma correctness blending artifacts": {
    why: "Blending in sRGB produces incorrect results - two half-bright lights add to white instead of being twice as bright. Linear space blending is physically correct.",
    code: '# In GLSL:\n# vec3 color = texture(uAlbedo, vTexCoord).rgb;\n# color = pow(color, vec3(2.2));  // sRGB -> linear\n# vec3 lit = computeLighting(color, normal, lightDir);\n# lit = pow(lit, vec3(1.0/2.2)); // linear -> sRGB\n# In OpenGL, use GL_SRGB8_ALPHA8 for automatic conversion'
  },
  "Depth/stencil tests transparency sorting back-to-front": {
    why: "Without depth testing, objects render in arbitrary order. Transparent objects cannot use depth writes, so they MUST be sorted back-to-front and rendered after opaque geometry.",
    code: 'from OpenGL.GL import *\nglEnable(GL_DEPTH_TEST)\nglDepthFunc(GL_LESS)\nglDepthMask(GL_TRUE)\nfor obj in opaque_objects: render(obj)  # any order is fine\nglDepthMask(GL_FALSE)  # transparent: no depth write\nglEnable(GL_BLEND)\nglBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)\ntransparent_objects.sort(key=lambda o: -distance_to_camera(o))\nfor obj in transparent_objects: render(obj)\nglDepthMask(GL_TRUE)'
  },
  "Frame pacing delta-time physics decoupling fixed timestep": {
    why: "Without delta-time, physics runs faster on 120Hz monitors and slower on 30fps devices. Fixed timestep decouples physics from rendering for consistent behavior.",
    code: 'import time\nclass FixedTimestep:\n    def __init__(self, fixed_dt=1/60):\n        self.fixed_dt, self.accumulator, self.last = fixed_dt, 0.0, time.perf_counter()\n    def update(self, physics_update, render):\n        now = time.perf_counter()\n        self.accumulator += min(now - self.last, 0.25)\n        self.last = now\n        while self.accumulator >= self.fixed_dt:\n            physics_update(self.fixed_dt)  # always same dt -> deterministic\n            self.accumulator -= self.fixed_dt\n        render(self.accumulator / self.fixed_dt)  # alpha for interpolation'
  },
  "Ray tracing ray-sphere/triangle intersections Whitted intro": {
    why: "Ray tracing simulates light paths for realistic reflections, refractions, and shadows. Every visual effect builds on knowing where a ray hits a surface.",
    code: 'import numpy as np\ndef ray_sphere_intersect(ray_origin, ray_dir, center, radius):\n    oc = ray_origin - center\n    a = np.dot(ray_dir, ray_dir)\n    b = 2.0 * np.dot(oc, ray_dir)\n    c = np.dot(oc, oc) - radius ** 2\n    discriminant = b * b - 4 * a * c\n    if discriminant < 0: return None\n    t = (-b - np.sqrt(discriminant)) / (2.0 * a)\n    if t < 0: t = (-b + np.sqrt(discriminant)) / (2.0 * a)\n    if t < 0: return None\n    hit = ray_origin + t * ray_dir\n    return hit, (hit - center) / radius, t'
  },
  "LOD & culling frustum/occlusion performance survival kit": {
    why: "Rendering all objects at full detail wastes GPU work. LOD reduces polygon count for distant objects. Frustum culling skips objects outside camera view. Together they 10x frame rate.",
    code: 'def frustum_cull(self, camera_frustum):\n    return [obj for obj in self.objects if camera_frustum.intersects(obj.bounding_sphere)]\ndef select_lod(self, obj, cam_pos, distances=[10, 30, 80]):\n    dist = np.linalg.norm(obj.position - cam_pos)\n    if dist < distances[0]: return obj.mesh_high    # 10,000 tris\n    elif dist < distances[1]: return obj.mesh_medium  # 2,000 tris\n    elif dist < distances[2]: return obj.mesh_low     # 500 tris\n    else: return obj.mesh_billboard                   # 2 tris'
  },
  "pygame game loop events/draw/flip sprites groups collisions": {
    why: "Pygame provides the fastest path from Python to a playable game. Without a proper game loop (event->update->draw->flip), your game stutters, eats CPU, or ignores input.",
    code: 'import pygame, random, sys\nW, H = 800, 500\npygame.init()\nscreen = pygame.display.set_mode((W, H))\nclock = pygame.time.Clock()\nclass Ball:\n    def __init__(self):\n        self.r = random.randint(12, 26)\n        self.x = random.randint(self.r, W-self.r)\n        self.y = random.randint(self.r, H-self.r)\n        ang = random.uniform(0, 6.283)\n        speed = random.uniform(120, 260)\n        self.vx, self.vy = speed*random.cos(ang), speed*random.sin(ang)\n    def step(self, dt): self.x += self.vx*dt; self.y += self.vy*dt\n    def draw(self, surf): pygame.draw.circle(surf, (200,100,50), (int(self.x),int(self.y)), self.r)\nballs = [Ball() for _ in range(14)]\nwhile True:\n    dt = clock.tick(60) / 1000.0\n    for e in pygame.event.get():\n        if e.type == pygame.QUIT: sys.exit()\n    screen.fill((15, 18, 32))\n    for b in balls: b.step(dt); b.draw(screen)\n    pygame.display.flip()'
  },
  "matplotlib 3D surfaces/scatter wireframes publication figures": {
    why: "Matplotlib is the standard for scientific visualization and publication-quality figures. Required for ML loss landscape visualization and spatial data communication.",
    code: 'import numpy as np\nimport matplotlib.pyplot as plt\nx = np.linspace(-4, 4, 200)\nX, Y = np.meshgrid(x, x)\nZ = np.sinc(np.sqrt(X**2 + Y**2))\nfig = plt.figure(figsize=(11, 5))\nax1 = fig.add_subplot(121, projection="3d")\nax1.plot_surface(X, Y, Z, cmap="viridis", linewidth=0, antialiased=True)\nax2 = fig.add_subplot(122, projection="3d")\nax2.plot_wireframe(X[::8,::8], Y[::8,::8], Z[::8,::8], color="#7c3aed", linewidth=0.6)\nplt.savefig("surface.png", dpi=130)'
  },
  "plotly interactive 3D meshes camera controls export HTML": {
    why: "Matplotlib figures are static images. Plotly generates interactive 3D visualizations with zoom, rotate, and hover tooltips that embed in web apps for data dashboards.",
    code: 'import plotly.graph_objects as go\nimport numpy as np\nx = np.linspace(-5, 5, 50)\nX, Y = np.meshgrid(x, x)\nZ = np.sin(np.sqrt(X**2 + Y**2))\nfig = go.Figure(data=[go.Surface(x=x, y=x, z=Z, colorscale="Viridis")])\nfig.update_layout(title="Interactive 3D Surface", width=800, height=600)\nfig.write_html("surface_interactive.html")'
  },
  "OpenGL via PyModernGL raw GL pythonic buffers shaders": {
    why: "PyModernGL wraps OpenGL in Pythonic APIs while keeping full GPU access. Raw OpenGL in Python is verbose; PyModernGL eliminates boilerplate while preserving shader and buffer control.",
    code: 'import moderngl\nimport numpy as np\nctx = moderngl.create_standalone_context()\nprog = ctx.program(\n    vertex_shader="""#version 330\n    in vec2 in_vert; in vec3 in_color; out vec3 v_color;\n    void main() { gl_Position = vec4(in_vert, 0.0, 1.0); v_color = in_color; }""",\n    fragment_shader="""#version 330\n    in vec3 v_color; out vec4 fragColor;\n    void main() { fragColor = vec4(v_color, 1.0); }""",)\nvertices = np.array([-0.5,-0.5,1,0,0, 0.5,-0.5,0,1,0, 0.0,0.5,0,0,1], dtype="f4")\nvbo = ctx.buffer(vertices)\nvao = ctx.simple_vertex_array(prog, vbo, "in_vert", "in_color")\nfbo = ctx.simple_framebuffer((800, 600))\nfbo.use()\nfbo.clear(0.1, 0.1, 0.1)\nvao.render(moderngl.TRIANGLES)'
  },
  "Three.js scene/mesh/material/light renderer animation loop JS": {
    why: "Three.js is the dominant 3D library for the web. Without it, WebGL development requires hundreds of lines of boilerplate. Three.js provides materials, lights, cameras, and loaders out of the box.",
    code: 'import * as THREE from "three";\nconst scene = new THREE.Scene();\nconst camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);\nconst renderer = new THREE.WebGLRenderer({ antialias: true });\nrenderer.setSize(innerWidth, innerHeight);\ndocument.body.appendChild(renderer.domElement);\nconst geometry = new THREE.BoxGeometry(1, 1, 1);\nconst material = new THREE.MeshStandardMaterial({ color: 0x00ff88, metalness: 0.3, roughness: 0.7 });\nconst cube = new THREE.Mesh(geometry, material);\nscene.add(cube);\nscene.add(new THREE.AmbientLight(0xffffff, 0.4));\ncamera.position.z = 3;\nfunction animate() {\n    requestAnimationFrame(animate);\n    cube.rotation.x += 0.01; cube.rotation.y += 0.01;\n    renderer.render(scene, camera);\n}\nanimate();'
  },
  "WebGL2 from scratch triangle program compile/link ceremony": {
    why: "Understanding raw WebGL2 teaches you what Three.js does under the hood. Without this knowledge, debugging shader compilation errors or optimizing draw calls is impossible.",
    code: 'const gl = document.getElementById("c").getContext("webgl2");\nconst vs = gl.createShader(gl.VERTEX_SHADER);\ngl.shaderSource(vs, `#version 300 es\nin vec2 aPosition; in vec3 aColor; out vec3 vColor;\nvoid main() { gl_Position = vec4(aPosition,0,1); vColor = aColor; }`);\ngl.compileShader(vs);\nconst fs = gl.createShader(gl.FRAGMENT_SHADER);\ngl.shaderSource(fs, `#version 300 es\nin vec3 vColor; out vec4 fragColor;\nvoid main() { fragColor = vec4(vColor,1); }`);\ngl.compileShader(fs);\nconst prog = gl.createProgram();\ngl.attachShader(prog,vs); gl.attachShader(prog,fs); gl.linkProgram(prog);\ngl.useProgram(prog);\nconst vbo = gl.createBuffer();\ngl.bindBuffer(gl.ARRAY_BUFFER, vbo);\ngl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5,-0.5,1,0,0, 0.5,-0.5,0,1,0, 0,0.5,0,0,1]), gl.STATIC_DRAW);\nconst posLoc = gl.getAttribLocation(prog,"aPosition");\ngl.enableVertexAttribArray(posLoc);\ngl.vertexAttribPointer(posLoc,2,gl.FLOAT,false,20,0);\ngl.drawArrays(gl.TRIANGLES,0,3);'
  },
  "Canvas 2D paths/gradients/composites charts games light": {
    why: "Canvas 2D is the simplest graphics API in the browser - no shaders, no GPU setup, just immediate-mode drawing. Perfect for data visualizations, simple games, and animated backgrounds.",
    code: 'const canvas = document.getElementById("canvas");\nconst ctx = canvas.getContext("2d");\nconst gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 100);\ngradient.addColorStop(0, "#7c3aed");\ngradient.addColorStop(1, "#3b82f6");\nctx.beginPath();\nctx.arc(200, 200, 100, 0, Math.PI * 2);\nctx.fillStyle = gradient;\nctx.fill();'
  },
  "Manim math animations scenes transform explanations": {
    why: "Manim generates mathematical animations programmatically, creating visualizations popularized by 3Blue1Brown. Without it, explaining calculus or algorithms visually requires hours of After Effects work.",
    code: 'from manim import *\nclass FourierCircles(Scene):\n    def construct(self):\n        title = Text("Fourier Series Visualization").to_edge(UP)\n        self.play(Write(title))\n        circles = VGroup()\n        for i in range(1, 8):\n            radius = 1 / (i * 2 - 1)\n            circle = Circle(radius=radius, color=BLUE, stroke_width=1)\n            if i > 1: circle.move_to(circles[-1].get_end())\n            circles.add(circle)\n        self.play(Create(circles), run_time=2)'
  },
  "Blender Python scripting bpy procedural geometry automation": {
    why: "Blender Python API (bpy) lets you generate 3D models, materials, and animations programmatically. Manual modeling does not scale - bpy creates thousands of variations for game assets.",
    code: 'import bpy\nbpy.ops.mesh.primitive_torus_add(major_radius=2, minor_radius=0.5, major_segments=100)\ntorus = bpy.context.active_object\ntorus.name = "ProceduralKnot"\nmat = bpy.data.materials.new(name="ProceduralMat")\nmat.use_nodes = True\nnodes = mat.node_tree.nodes\nnoise = nodes.new("ShaderNodeTexNoise")\nnoise.inputs["Scale"].default_value = 4.0\ntorus.data.materials.append(mat)'
  },
  "Shader toys SDFs raymarching distance functions art": {
    why: "Signed Distance Functions define 3D shapes mathematically. Raymarching renders SDFs without geometry, enabling complex scenes in a single shader with infinite resolution.",
    code: 'float sdSphere(vec3 p, float r) { return length(p) - r; }\nfloat sdBox(vec3 p, vec3 b) {\n    vec3 q = abs(p) - b;\n    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);\n}\nfloat opSmoothUnion(float d1, float d2, float k) {\n    float h = clamp(0.5 + 0.5*(d2-d1)/k, 0.0, 1.0);\n    return mix(d2, d1, h) - k*h*(1.0-h);\n}\nfloat scene(vec3 p) {\n    return opSmoothUnion(sdSphere(p, 1.0), sdBox(p - vec3(1.5,0,0), vec3(0.8)), 0.5);\n}'
  },
  "Compute shaders GPU parallel intro dispatch/workgroups": {
    why: "Compute shaders run arbitrary parallel computations on the GPU - 10,000x faster than CPU for suitable workloads. Used for particle systems, physics, image processing, and ML preprocessing.",
    code: '#version 310 es\nlayout(local_size_x = 256) in;\nlayout(std430, binding = 0) buffer InputBuffer { float values[]; };\nlayout(std430, binding = 1) buffer OutputBuffer { float results[]; };\nuniform float uScale;\nvoid main() {\n    uint idx = gl_GlobalInvocationID.x;\n    if (idx >= values.length()) return;\n    results[idx] = values[idx] * uScale;  // each GPU thread processes one element\n}\n// glDispatchCompute(ceil(num_elements / 256.0), 1, 1);'
  },
  "Game math quaternions gimbal-lock-free rotation slerp": {
    why: "Euler angles suffer from gimbal lock - rotating 90 on one axis causes two axes to align, losing a degree of freedom. Quaternions avoid this and interpolate smoothly (SLERP).",
    code: 'import numpy as np\ndef axis_angle_to_quaternion(axis, angle_rad):\n    axis = np.array(axis, dtype=float)\n    axis /= np.linalg.norm(axis)\n    half = angle_rad / 2\n    return np.array([np.cos(half), *(axis * np.sin(half))])\ndef slerp(q1, q2, t):\n    dot = np.dot(q1, q2)\n    if dot < 0: q2 = -q2; dot = -dot  # take shortest path\n    if dot > 0.9995: return q1 + t * (q2 - q1)  # nearly parallel\n    theta = np.arccos(np.clip(dot, -1, 1))\n    return (np.sin((1-t)*theta)*q1 + np.sin(t*theta)*q2) / np.sin(theta)\nq_start = axis_angle_to_quaternion([0,1,0], 0)\nq_end = axis_angle_to_quaternion([0,1,0], np.pi/2)\nq_interp = slerp(q_start, q_end, 0.5)  # smooth halfway rotation'
  },
};
