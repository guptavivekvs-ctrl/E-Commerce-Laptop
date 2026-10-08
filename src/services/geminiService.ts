import { GoogleGenerativeAI } from '@google/generative-ai';
import { Product } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export interface ChatResponse {
  text: string;
  recommendedProducts: Product[];
}

export class GeminiService {
  static isConfigured(): boolean {
    return Boolean(GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here');
  }

  static async askLaptopAssistant(
    userQuery: string,
    products: Product[],
    chatHistory: { sender: 'user' | 'assistant'; text: string }[] = []
  ): Promise<ChatResponse> {
    // 1. Try real Gemini API if key is supplied
    if (this.isConfigured()) {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Provide catalogue context
        const catalogContext = products.map((p) => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          price: p.price,
          processor: p.processor,
          ram: p.ram,
          storage: p.storage,
          graphics: p.graphics,
          display: p.display,
        }));

        const systemPrompt = `You are "TechNova AI", an elite laptop shopping advisor for the TechNova laptop store.
Your goal is to recommend the best laptops from our active catalog to customers, answer hardware questions (CPUs, GPUs, RAM, thermals), explain specs, compare laptops, and help buyers choose according to their budget and workflow (Coding, Gaming, AI/ML, Video Editing, College/Student).

CURRENT TECHNOVA CATALOG:
${JSON.stringify(catalogContext, null, 2)}

INSTRUCTIONS:
1. Always prefer recommending actual laptops from the TechNova catalog above. Mention the laptop name and price in Indian Rupees (₹).
2. When you recommend one or more laptops, at the end of your response append a line with:
   RECOMMENDED_IDS: [comma separated product IDs from the catalog]
   For example: RECOMMENDED_IDS: asus-vivobook-16x-gaming, acer-swift-go-14-oled
3. Be friendly, knowledgeable, concise, and structured with bullet points.
4. If the user asks for coding, highlight CPU cores, RAM, and keyboard.
5. If the user asks for AI/ML or Gaming, highlight RTX GPU VRAM, CUDA cores, and cooling.
6. If the user specifies a budget (e.g. under ₹70,000), strictly prioritize models within or close to that budget.`;

        // Format history
        const contents = [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'Understood. I am TechNova AI, ready to help customers find their ideal laptop from our catalog.' }] },
          ...chatHistory.map((h) => ({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }],
          })),
          { role: 'user', parts: [{ text: userQuery }] },
        ];

        const result = await model.generateContent({ contents });
        const responseText = result.response.text();

        // Parse recommended IDs
        const matchedProducts: Product[] = [];
        const regex = /RECOMMENDED_IDS:\s*([^\n\r]+)/i;
        const match = responseText.match(regex);
        let cleanedText = responseText;

        if (match && match[1]) {
          cleanedText = responseText.replace(regex, '').trim();
          const ids = match[1]
            .split(',')
            .map((s) => s.trim().replace(/[\[\]'"`]/g, ''));
          for (const id of ids) {
            const found = products.find((p) => p.id === id);
            if (found && !matchedProducts.some((m) => m.id === found.id)) {
              matchedProducts.push(found);
            }
          }
        }

        // If none extracted explicitly from tag, check if product names are mentioned
        if (matchedProducts.length === 0) {
          for (const p of products) {
            if (responseText.toLowerCase().includes(p.name.toLowerCase().split(' ')[0] + ' ' + p.name.toLowerCase().split(' ')[1])) {
              matchedProducts.push(p);
              if (matchedProducts.length >= 3) break;
            }
          }
        }

        return {
          text: cleanedText,
          recommendedProducts: matchedProducts,
        };
      } catch (err) {
        console.warn('Gemini API call error, utilizing local recommendation engine:', err);
      }
    }

    // 2. Intelligent local fallback recommendation engine
    return this.generateSmartLocalRecommendation(userQuery, products);
  }

  private static generateSmartLocalRecommendation(
    query: string,
    products: Product[]
  ): ChatResponse {
    const q = query.toLowerCase();

    // Budget extraction (e.g. 50000, 70000, 1 lakh, 1.5L)
    let maxBudget = Infinity;
    const numberMatch = q.match(/(under|below|less than|within|budget of)?\s*(?:rs\.?|inr|₹)?\s*(\d{1,2}(?:,\d{2,3})*(?:\.\d+)?|\d+)\s*(k|thousand|l|lakh|lac)?/i);
    
    if (numberMatch && numberMatch[2]) {
      let num = parseFloat(numberMatch[2].replace(/,/g, ''));
      const unit = (numberMatch[3] || '').toLowerCase();
      if (unit === 'k' || unit === 'thousand') num *= 1000;
      else if (unit === 'l' || unit === 'lakh' || unit === 'lac') num *= 100000;
      else if (num < 1000 && num > 10) num *= 1000; // e.g. "under 50" -> 50,000
      maxBudget = num;
    }

    let recommended: Product[] = [];
    let explanation = '';

    // Intent: AI / ML
    if (q.includes('ai') || q.includes('ml') || q.includes('machine learning') || q.includes('deep learning')) {
      recommended = products.filter(
        (p) =>
          p.price <= maxBudget &&
          (p.graphics.includes('RTX') || p.processor.includes('M3') || p.category.includes('AI') || p.processor.includes('Snapdragon'))
      );
      if (recommended.length === 0) recommended = products.filter((p) => p.category.includes('AI') || p.graphics.includes('RTX'));
      recommended.sort((a, b) => b.price - a.price);

      explanation = `### 🧠 Recommendations for AI & Machine Learning Workflows
For deep learning, local LLM fine-tuning, and PyTorch/TensorFlow, having dedicated **GPU Tensor Cores (NVIDIA RTX)** or high-bandwidth **unified memory (Apple Silicon / NPU TOPS)** is critical:

Here are the top picks currently available in our TechNova inventory:`;
    }
    // Intent: Coding / Programming
    else if (q.includes('cod') || q.includes('program') || q.includes('developer') || q.includes('software') || q.includes('web dev')) {
      recommended = products.filter(
        (p) =>
          p.price <= maxBudget &&
          (parseInt(p.ram) >= 16 || p.ram.includes('16GB') || p.ram.includes('32GB') || p.ram.includes('36GB'))
      );
      if (recommended.length === 0) recommended = products.filter((p) => p.price <= maxBudget);
      recommended.sort((a, b) => a.price - b.price);

      explanation = `### 💻 Best TechNova Laptops for Coding & Software Development
Software engineering requires a fast multi-core processor (compiling code, running Docker), at least **16GB of RAM** for IDEs and browser tabs, and a crisp display for long hours of reading code:

Here are our top recommended models matching your criteria:`;
    }
    // Intent: Gaming
    else if (q.includes('game') || q.includes('gaming') || q.includes('esports') || q.includes('fps')) {
      recommended = products.filter(
        (p) => p.price <= maxBudget && (p.category === 'Gaming' || p.graphics.includes('RTX'))
      );
      if (recommended.length === 0) recommended = products.filter((p) => p.category === 'Gaming');
      recommended.sort((a, b) => b.price - a.price);

      explanation = `### 🎮 Top Gaming Laptops
For competitive gaming and AAA titles, high-refresh displays (120Hz-240Hz), low latency, and dedicated NVIDIA GeForce RTX graphics are crucial:

Check out these stellar gaming rigs in stock:`;
    }
    // Intent: Student / College / Budget
    else if (q.includes('student') || q.includes('college') || q.includes('school') || q.includes('study') || q.includes('budget') || maxBudget < 60000) {
      recommended = products.filter((p) => p.price <= maxBudget);
      if (recommended.length === 0) recommended = products.filter((p) => p.category === 'Student & Everyday');
      recommended.sort((a, b) => a.price - b.price);

      explanation = `### 🎓 Best Student & Budget Laptops
For college lectures, assignments, media consumption, and daily productivity, you need dependable battery life, a lightweight build, and great value for money:

Here are our top value picks suited for students:`;
    }
    // Intent: Creator / Video Editing
    else if (q.includes('video') || q.includes('edit') || q.includes('creator') || q.includes('design') || q.includes('photoshop')) {
      recommended = products.filter(
        (p) => p.price <= maxBudget && (p.category.includes('Creator') || p.display.includes('OLED') || p.brand === 'Apple')
      );
      if (recommended.length === 0) recommended = products.filter((p) => p.category.includes('Creator'));
      recommended.sort((a, b) => b.price - a.price);

      explanation = `### 🎨 Best Laptops for Video Editing & Creative Work
Video editors and designers benefit from color-calibrated DCI-P3 displays (OLED/Liquid Retina XDR), dedicated GPU render encoders, and ample RAM:

These top creator workstations deliver exceptional results:`;
    }
    // Intent: Compare
    else if (q.includes('compare') || q.includes('difference') || q.includes('versus') || q.includes('vs')) {
      recommended = products.slice(0, 2);
      explanation = `### ⚖️ Laptop Comparison Guide
When comparing laptops at TechNova, here is how to weigh key factors:
- **Processor (CPU)**: Look for Intel Core Ultra / 14th Gen or AMD Ryzen 8000 for high thread counts.
- **Memory (RAM)**: 16GB is the modern sweet spot; 32GB+ is ideal for heavy virtual machines or 4K rendering.
- **Display**: OLED provides infinite contrast and deep blacks; 120Hz+ provides silky smooth responsiveness.

Here are two popular options from our catalog side-by-side:`;
    }
    // General queries
    else {
      recommended = products.filter((p) => p.price <= maxBudget);
      if (recommended.length === 0) recommended = products.slice(0, 3);
      recommended = recommended.slice(0, 3);

      explanation = `### ✨ TechNova Laptop Recommendations
Welcome to TechNova! I analyzed your query across our live inventory. Here are stellar choices tailored for exceptional performance, durability, and value:`;
    }

    const topRecommendations = recommended.slice(0, 3);

    // Build markdown body with specs
    let body = `${explanation}\n\n`;
    topRecommendations.forEach((p, idx) => {
      body += `**${idx + 1}. [${p.name}](/laptops/${p.id})** — **₹${p.price.toLocaleString('en-IN')}** ${(p.discount ? `*(Save ${p.discount}% off ₹${p.originalPrice.toLocaleString('en-IN')})*` : '')}
- **Processor:** ${p.processor}
- **RAM & Storage:** ${p.ram} | ${p.storage}
- **Graphics:** ${p.graphics}
- **Display:** ${p.display}
- **Why it fits:** ${p.description.slice(0, 140)}...\n\n`;
    });

    body += `\n*Need to narrow this down or check color availability? Feel free to ask about specific processors, RAM requirements, or click on any laptop above to view full details!*`;

    return {
      text: body,
      recommendedProducts: topRecommendations,
    };
  }
}
