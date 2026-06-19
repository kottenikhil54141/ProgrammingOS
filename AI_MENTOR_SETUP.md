# AI Mentor Setup Guide

## 🎓 What's New?

Your ProgrammingOS platform now has a **real AI Mentor** that can:
- ✅ Answer Python & JavaScript questions intelligently (like ChatGPT)
- ✅ Explain code and concepts in detail
- ✅ Help debug errors without giving away solutions
- ✅ Provide context-aware responses based on your current topic
- ✅ Maintain conversation history for continuity

## 🚀 Quick Start

### Step 1: Get an API Key

Choose one option:

#### Option A: Using OpenAI (Recommended for ChatGPT power)
1. Visit [platform.openai.com/api/keys](https://platform.openai.com/api/keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (format: `sk-...`)
5. Keep it secure!

> **Cost**: Pay-as-you-go. Typical chatting costs ~$0.001-0.01 per question

#### Option B: Using Alternative LLMs
- Claude API: [console.anthropic.com](https://console.anthropic.com)
- Cohere API: [dashboard.cohere.com](https://dashboard.cohere.com)
- Any custom LLM endpoint with compatible API format

### Step 2: Configure in ProgrammingOS

1. **Open Python Learning Page** → Go to `/python` route
2. **Click the Key Icon** 🔑 in the top-right AI Mentor Panel
3. **Fill in the Configuration**:
   - **Provider**: Select "OpenAI" (or "Custom" for other APIs)
   - **API Key**: Paste your key from step 1
   - **Custom Endpoint** (optional): If using custom provider
   - **Model** (optional): Specify model name (default: gpt-3.5-turbo)

4. **Click "Save & Activate"**
5. ✅ You'll see a green "LLM Active" badge when connected

### Step 3: Start Chatting!

Ask questions in the AI Mentor chat panel:
- "Explain what variables mean in Python"
- "How does this code work?" 
- "Give me a hint for the chaos exercise"
- "What's the difference between list and tuple?"

## 🏗️ Architecture

### Real AI Mentor Flow
```
User Message
    ↓
getAIMentorResponse()
    ↓
Is API Configured?
    ├─ YES → RealAIMentorService.sendMessage()
    │         ├─ OpenAI API Call
    │         └─ Return LLM Response
    │
    └─ NO  → Fallback to Mock Response
             (Basic pattern-matching)
```

### Files Involved

| File | Purpose |
|------|---------|
| `src/services/realAIMentor.ts` | LLM API integration service |
| `src/utils/aiMentor.ts` | Main AI mentor logic with fallback |
| `src/app/python/page.tsx` | UI integration & chat handler |
| `src/services/pythonCurriculumClasses.ts` | Structured curriculum topics |

## 💡 Features

### Context-Aware Responses
The AI mentor knows:
- Which topic you're learning
- Current lesson objectives
- What Chaos exercise you're working on
- Your learning level (Beginner/Intermediate/Advanced)

### Fallback System
If API is down or unconfigured:
- Uses smart pattern matching on your question
- Provides relevant mock responses
- Never leaves you without help!

### Security
- API keys stored in browser localStorage
- Can be cleared anytime by unconfiguring
- Never sent to external servers (except LLM provider)
- Conversations not persisted server-side

## 📝 Example Conversations

### Example 1: Understanding a Concept
```
You: "Explain what 'is' means in Python"

AI Mentor: 
"The 'is' operator checks object IDENTITY, not equality:

x = [1, 2]
y = [1, 2]
x == y  # True - same contents
x is y  # False - different objects

Use 'is' to check if two variables point to the SAME object 
in memory. Use '==' to check if values are equal."
```

### Example 2: Getting a Hint
```
You: "I'm stuck on the Chaos exercise, give me a hint"

AI Mentor:
"💡 Study Hint for 'Shared Reference Mutation Bug'

The problem is that guest_users and vip_users point to 
the SAME list in memory. When you append to vip_users, 
you're actually modifying guest_users too!

Try creating a COPY of the list instead of just assigning it.
(Hint: Use list() constructor or list slicing)"
```

### Example 3: Debugging Code
```
You: "Why is this giving me an error?

def greet():
  print("Hi")  # Wrong indentation
print(greet())

AI Mentor:
"❌ IndentationError: The line 'print(\"Hi\")' has incorrect 
indentation. In Python, all code inside a function must be 
indented consistently (usually 4 spaces).

✅ Fixed:
def greet():
    print(\"Hi\")  # 4 spaces indentation
print(greet())"
```

## ⚙️ Advanced Configuration

### Using Custom LLM Endpoint

If you're using your own LLM server:

1. Select "Custom" provider
2. **API Endpoint**: Where requests go (e.g., `http://localhost:8000/v1/chat/completions`)
3. **Model**: Your model name
4. Make sure your server accepts:
   ```json
   {
     "messages": [
       {"role": "system", "content": "..."},
       {"role": "user", "content": "..."}
     ],
     "temperature": 0.7,
     "max_tokens": 1000
   }
   ```

### Troubleshooting

| Problem | Solution |
|---------|----------|
| "API not configured" | Click 🔑 and fill in your API key |
| 401 Unauthorized | Check if API key is correct |
| 429 Rate Limited | API quota exceeded. Wait or upgrade plan |
| Slow responses | Normal - depends on model. gpt-4 is slower than gpt-3.5 |
| Mock responses only | API configuration failed. Check credentials |

## 🎯 Best Practices

1. **Be Specific**: Instead of "explain Python", say "explain how list slicing works"
2. **Show Code**: Paste code snippets for debugging help
3. **Ask Follow-ups**: Build on previous responses for deeper understanding
4. **Use Hints First**: Ask for hints before asking for solutions
5. **Verify Answers**: Cross-reference with documentation when learning

## 📚 Python Topics Covered

### Phase 1: Foundations
- ✅ Python Introduction
- ✅ Variables & Memory Reference  
- ✅ Data Types & Type Conversion
- ⏳ Operators & Expressions
- ⏳ Input & Output

### Phase 2: Control Flow
- ⏳ Conditional Logic (if/elif/else)
- ⏳ Loops & Iteration (for, while)
- ⏳ Break & Continue

### Phase 3-8 Coming Soon
- Data Structures (lists, dicts, sets)
- Functions & Scope
- Modules & Imports
- Object-Oriented Programming
- Advanced Features
- Standard Library

## 🔄 Supporting Both Python & JavaScript

The AI Mentor works with both languages:

```javascript
// JavaScript questions work too!
// "Explain async/await"
// "How does 'this' binding work?"
// "What's the event loop?"
```

The same API configuration works for both. Just ask in JavaScript mode!

## 💬 Feedback & Improvements

Have suggestions? Issues?
- Check if AI is configured properly (look for green badge)
- Try the fallback mock responses for comparison
- Consider upgrading to gpt-4 for better responses

## 📞 Support

For issues with:
- **API Key**: Check the provider's documentation
- **ProgrammingOS**: Refer to main README
- **General Learning**: Use the AI Mentor! It's designed to help

---

**Happy Learning! 🚀** Your AI Mentor is ready to help 24/7!
