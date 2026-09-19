// Mini FAQ chatbot — answers visitor questions about Darshan D G.
// Pure keyword matching against a small knowledge base, no external API.
document.addEventListener('DOMContentLoaded', function () {
    const widget = document.querySelector('.chatbot-widget');
    const toggleBtn = document.getElementById('chatbotToggle');
    const closeBtn = document.getElementById('chatbotClose');
    const messagesEl = document.getElementById('chatbotMessages');
    const form = document.getElementById('chatbotForm');
    const input = document.getElementById('chatbotInput');
    const quickReplies = document.getElementById('chatbotQuickReplies');

    if (!widget || !toggleBtn || !form || !input || !messagesEl) return;

    const knowledgeBase = [
        {
            keywords: ['hi', 'hello', 'hey', 'yo', 'sup', 'howdy', 'good morning', 'good afternoon', 'good evening'],
            responses: [
                "Hey there! I'm Sara. Ask me anything about Darshan D G — his skills, experience, projects, or how to reach him.",
                "Hi! I can fill you in on Darshan's DevOps background, projects, or contact info. What are you curious about?"
            ]
        },
        {
            keywords: ['who are you', 'your name', 'what is your name', 'are you a bot', 'are you real', 'are you human', 'are you ai'],
            responses: [
                "I'm Sara — a small assistant built into this portfolio to answer questions about Darshan D G. I'm not a general AI, just a focused guide to his work!",
                "I'm Sara, Darshan's portfolio assistant. Think of me as a quick FAQ guide — ask me about his skills, projects, or how to contact him."
            ]
        },
        {
            keywords: ['how are you', "how's it going", 'hows it going', 'whats up', "what's up", 'how is life', 'hows life'],
            responses: [
                "I'm doing great, thanks for asking! Ready to tell you all about Darshan — where should we start?",
                "All good on my end! Want to know about Darshan's skills, experience, or projects?"
            ]
        },
        {
            keywords: ['who is darshan', 'about darshan', 'introduce yourself', 'introduce him', 'tell me about him', 'tell me about darshan', 'darshan d g'],
            responses: [
                "Darshan D G is a DevOps Engineer based in Bengaluru, Karnataka, specializing in infrastructure automation, cloud deployment, and CI/CD pipeline design. He has 2+ years of DevOps experience across 15+ infrastructure projects.",
                "Darshan is a DevOps Engineer from Bengaluru with 2+ years of experience turning infrastructure headaches into automated, reliable systems — containers, cloud, and CI/CD pipelines are his bread and butter."
            ]
        },
        {
            keywords: ['skill', 'skills', 'technology', 'technologies', 'tech stack', 'tool', 'tools', 'stack', 'programming language', 'devops tools', 'expertise', 'proficient', 'what can he do', 'what does he know', 'know how to use'],
            responses: [
                "Darshan works with:\n• Containers: Docker, Kubernetes, Docker Compose\n• IaC: Terraform, Ansible, CloudFormation\n• Cloud: AWS, Azure, Google Cloud\n• CI/CD: Jenkins, GitHub Actions, GitLab CI/CD\n• Monitoring: Prometheus, Grafana, ELK Stack\n• Scripting: Python, Bash/Shell, Git"
            ]
        },
        {
            keywords: ['docker'],
            responses: ["Yes! Docker is one of Darshan's strongest skills — he uses it heavily for containerizing applications and building reproducible environments (see the Skills section for his full container/orchestration stack)."]
        },
        {
            keywords: ['kubernetes', 'k8s'],
            responses: ["Darshan works with Kubernetes for orchestrating containers at scale — check out his 'End-to-End CI/CD Pipeline' project, which deploys straight to Kubernetes."]
        },
        {
            keywords: ['aws', 'amazon web services'],
            responses: ["AWS is one of Darshan's core cloud platforms — his 'Fathom V2' and 'Infrastructure as Code Deployment' projects are both built on AWS (ECS Fargate, RDS, VPC, EC2, and more)."]
        },
        {
            keywords: ['terraform'],
            responses: ["Yes, Terraform is central to how Darshan does Infrastructure as Code — he's used it to provision full AWS environments including VPCs, RDS, and load balancers."]
        },
        {
            keywords: ['experience', 'years', 'background', 'work history', 'how long', 'professional experience'],
            responses: [
                "Darshan has 2+ years of hands-on DevOps experience, having worked across 15+ infrastructure projects with a track record of maintaining 98% system uptime."
            ]
        },
        {
            keywords: ['education', 'degree', 'study', 'college', 'qualification', 'academic'],
            responses: ["Darshan holds a Diploma in Mechatronics Engineering with a Computer Science focus (2023–2025)."]
        },
        {
            keywords: ['location', 'based', 'live', 'where', 'city', 'country'],
            responses: ["Darshan is based in Bengaluru, Karnataka, India."]
        },
        {
            keywords: ['service', 'services', 'what do you do', 'offer', 'help with', 'what does he offer', 'hire him for'],
            responses: ["Darshan offers: Infrastructure Automation, Containerization & Orchestration, Cloud Infrastructure Management, CI/CD Pipeline Development, Monitoring & Observability, and Security & Compliance."]
        },
        {
            keywords: ['project', 'projects', 'portfolio', 'built', 'work on', 'worked on', 'github repo', 'show me work', 'case study'],
            responses: [
                "Some of Darshan's featured projects: an AI-driven identity verification system (BHARATVERIFY), an end-to-end CI/CD pipeline with Jenkins/Docker/Kubernetes, an AWS staging architecture for Fathom V2 (ECS Fargate + RDS), and Terraform-based AWS infrastructure deployments. Scroll down to the Projects section to see them all!"
            ]
        },
        {
            keywords: ['contact', 'email', 'reach', 'hire', 'get in touch', 'talk', 'connect', 'message him'],
            responses: ["You can reach Darshan at Darsharaja576@gmail.com, or use the contact form further down this page — messages go straight to his inbox. His GitHub is github.com/Darshan-raja."]
        },
        {
            keywords: ['cv', 'resume'],
            responses: ["The CV download isn't live on the site just yet — the quickest way to reach Darshan in the meantime is via the contact form or email (Darsharaja576@gmail.com)."]
        },
        {
            keywords: ['joke', 'funny', 'make me laugh'],
            responses: ["Why do DevOps engineers never get locked out? Because they always keep a backup key... in version control. 😄 Anyway — want to know about Darshan's skills or projects?"]
        },
        {
            keywords: ['nice', 'cool', 'awesome', 'great site', 'love this', 'impressive'],
            responses: ["Glad you like it! Darshan put a lot into this portfolio. Want to know more about his skills or see his projects?"]
        },
        {
            keywords: ['thank', 'thanks', 'appreciate'],
            responses: ["You're welcome! Let me know if there's anything else you'd like to know about Darshan."]
        },
        {
            keywords: ['bye', 'goodbye', 'see you', 'later', 'exit'],
            responses: ["Thanks for stopping by! Feel free to reach out to Darshan directly if you'd like to work together. 👋"]
        }
    ];

    const fallbacks = [
        "I'm a small FAQ assistant, so I don't quite have an answer for that. Try asking about Darshan's skills, experience, projects, or how to contact him.",
        "Hmm, I'm not sure about that one — I'm best at questions about Darshan's background, skills, and projects. Want to try one of those?",
        "That's outside what I know! I can help with Darshan's skills, experience, education, projects, or contact info though."
    ];

    function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Word-boundary match, not plain substring — otherwise short keywords
    // like "hi" or "yo" fire inside unrelated words like "hire" or "your".
    function matchesKeyword(normalized, keyword) {
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`\\b${escaped}\\b`, 'i').test(normalized);
    }

    function findResponse(text) {
        const normalized = text.toLowerCase();
        let best = null;
        let bestScore = 0;

        knowledgeBase.forEach((entry) => {
            const score = entry.keywords.reduce(
                (count, keyword) => count + (matchesKeyword(normalized, keyword) ? 1 : 0),
                0
            );
            if (score > bestScore) {
                bestScore = score;
                best = entry;
            }
        });

        return best ? pickRandom(best.responses) : pickRandom(fallbacks);
    }

    function addMessage(text, sender) {
        const bubble = document.createElement('div');
        bubble.className = `chatbot-message ${sender}`;
        bubble.textContent = text;
        messagesEl.appendChild(bubble);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
        const bubble = document.createElement('div');
        bubble.className = 'chatbot-message bot chatbot-typing';
        bubble.id = 'chatbotTypingIndicator';
        bubble.innerHTML = '<span></span><span></span><span></span>';
        messagesEl.appendChild(bubble);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function hideTyping() {
        document.getElementById('chatbotTypingIndicator')?.remove();
    }

    function respondTo(text) {
        addMessage(text, 'user');
        showTyping();
        // Randomized delay so replies don't all land at the same fixed beat
        const delay = 500 + Math.random() * 700;
        setTimeout(() => {
            hideTyping();
            addMessage(findResponse(text), 'bot');
        }, delay);
    }

    let greeted = false;
    function openChat() {
        widget.classList.add('active');
        if (!greeted) {
            greeted = true;
            showTyping();
            setTimeout(() => {
                hideTyping();
                addMessage("Hi, I'm Sara 👋 Ask me about Darshan's skills, experience, projects, or how to contact him.", 'bot');
            }, 700);
        }
        input.focus();
    }

    function closeChat() {
        widget.classList.remove('active');
    }

    toggleBtn.addEventListener('click', () => {
        widget.classList.contains('active') ? closeChat() : openChat();
    });

    closeBtn?.addEventListener('click', closeChat);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        respondTo(text);
        input.value = '';
    });

    quickReplies?.querySelectorAll('button[data-question]').forEach((btn) => {
        btn.addEventListener('click', () => {
            respondTo(btn.getAttribute('data-question'));
        });
    });

    document.addEventListener('click', (event) => {
        if (
            widget.classList.contains('active') &&
            !widget.contains(event.target)
        ) {
            closeChat();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && widget.classList.contains('active')) {
            closeChat();
        }
    });
});
