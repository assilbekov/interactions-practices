import { FONT_VAR_STORAGE_KEY } from "@/lib/fonts";
import { VARS_STORAGE_KEY } from "@/lib/theme-mixer";

// Blocking inline script that re-applies persisted theme vars and font before
// first paint, so a refresh never flashes the default colors/font.
const script = `try{
var s=document.documentElement.style,
v=JSON.parse(localStorage.getItem(${JSON.stringify(VARS_STORAGE_KEY)})||"{}");
for(var k in v)s.setProperty(k,v[k]);
var f=localStorage.getItem(${JSON.stringify(FONT_VAR_STORAGE_KEY)});
if(f)s.setProperty("--app-font-sans",f);
}catch(e){}`;

export function ThemeInitScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
