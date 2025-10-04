\## 🔧 Tech Stack \& Project Structure

1\. You are building a \*\*React application\*\*.  

2\. Use \*\*TypeScript\*\*.  

3\. Use \*\*React Router\*\*. KEEP the routes in `src/App.tsx`.  

4\. Always put all source code in the `src/` folder.  

5\. Pages must go into `src/pages/`.  

6\. Components must go into `src/components/`.  

7\. The \*\*main page (default page)\*\* is `src/pages/Index.tsx`.  

&nbsp;  - You MUST import and display any new components here.  

&nbsp;  - If you do not update `Index.tsx`, the user will NOT see the components.  



---



\## 🎨 Styling \& UI

8\. Always use \*\*Tailwind CSS\*\* for styling. Use utility classes extensively for layout, spacing, colors, borders, and typography.  

9\. Always use \*\*shadcn/ui\*\* components when possible (e.g., buttons, cards, inputs).  

&nbsp;  - Do NOT edit shadcn/ui source files.  

&nbsp;  - If customization is needed, create a new component in `src/components/`.  

10\. The \*\*lucide-react\*\* package is available for icons. Use it for icons inside buttons, headers, or UI elements.  

11\. Use \*\*Google Fonts\*\* for typography.  

&nbsp;   - Always import fonts via \[`@next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) (if using Next.js) or via `<link>` in `index.html` (for Vite/CRA).  

&nbsp;   - Apply the font using Tailwind’s `font-\[name]` utility classes by extending the Tailwind config if necessary.  



---



\## 🕹️ Graphics \& Game Libraries

12\. If \*\*PixiJS\*\* is needed:  

&nbsp;   - Install with:  

&nbsp;     ```bash

&nbsp;     npm install pixi.js

&nbsp;     ```  

&nbsp;   - Use PixiJS for \*\*interactive, animated, or game-like 2D graphics\*\*.  

&nbsp;   - Always wrap PixiJS in a React component inside `src/components/`.  

&nbsp;   - Example: bouncing ball, sprite animation, particle effects.  



13\. If \*\*Konva\*\* is needed:  

&nbsp;   - Install with:  

&nbsp;     ```bash

&nbsp;     npm install konva react-konva

&nbsp;     ```  

&nbsp;   - Use Konva for \*\*canvas-based interactive shapes, diagrams, or drag-and-drop elements\*\*.  

&nbsp;   - Always wrap Konva in a React component inside `src/components/`.  

&nbsp;   - Example: draggable shapes, editable nodes, flow diagrams.  



---



\## 🎬 Animations

14\. Use \*\*Motion One\*\* (`motion.dev`) for animations.  

&nbsp;   - Install with:  

&nbsp;     ```bash

&nbsp;     npm install motion

&nbsp;     ```  

&nbsp;   - Use `motion` for simple element animations (fade, slide, scale).  

&nbsp;   - Always keep animations inside components — do not put them in global files.  

&nbsp;   - Example:

&nbsp;     ```tsx

&nbsp;     import { motion } from "motion/react"



&nbsp;     <motion.div

&nbsp;       initial={{ opacity: 0 }}

&nbsp;       animate={{ opacity: 1 }}

&nbsp;       transition={{ duration: 0.5 }}

&nbsp;     >

&nbsp;       Hello with animation

&nbsp;     </motion.div>

&nbsp;     ```  



---



\## 🖼️ Assets Handling

15\. \*\*Do NOT hardcode asset paths\*\* (e.g. `"/assets/image.png"`). This will fail in production because Vite rewrites paths.  

16\. Always \*\*import assets directly\*\* so Vite can manage them correctly:  

&nbsp;  ```tsx

&nbsp;  import logo from "@/assets/logo.png";

&nbsp;  <img src={logo} alt="Logo" />

&nbsp;  ```

17\. For PixiJS or Konva, load textures/images through imports:

&nbsp;  ```tsx    

&nbsp; import spriteImg from "@/assets/sprite.png";

&nbsp; const sprite = PIXI.Sprite.from(spriteImg);

&nbsp; ```

18\. All assets should be placed inside src/assets/.

19\. Only use public/ for files that must remain unchanged (e.g., favicon).



\## 📄 Implementation Rules

20\. Always import new components into `src/pages/Index.tsx` and render them inside the page layout.  

21\. When creating a new PixiJS, Konva, or Motion One component:  

&nbsp;   - Put the file in `src/components/`.  

&nbsp;   - Use TypeScript.  

&nbsp;   - Center the canvas or content with Tailwind (`flex`, `justify-center`, `items-center`, `h-screen`).  

22\. Always keep components \*\*self-contained\*\*:  

&nbsp;   - Components must handle their own initialization (PixiJS app, Konva stage, or Motion animation).  

&nbsp;   - Do not leak logic into `Index.tsx` — just render the component.
