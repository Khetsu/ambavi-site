// ამბავი · Astro-ს პარამეტრები
// build.format: "file" — გვერდები იწყობა როგორც designs.html (და არა designs/index.html),
// ამიტომ ბმულები ისეთივე რჩება, როგორიც იყო, და აწყობილი საიტი ფაილიდანაც იხსნება.
import { defineConfig } from "astro/config";

export default defineConfig({
  build: { format: "file" },
  trailingSlash: "ignore"
});