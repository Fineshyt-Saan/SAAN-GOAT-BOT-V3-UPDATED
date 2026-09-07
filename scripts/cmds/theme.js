const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "theme",
    aliases: ["aitheme", "changetheme"],
    version: "2.0",
    author: "Siam Ahmed Saan",
    countDown: 5,
    role: 1,
    description: {
      vi: "Tạo và áp dụng chủ đề AI cho nhóm chat với xem trước hình ảnh",
      en: "Create and apply AI themes for chat group with image previews"
    },
    category: "box chat",
    guide: {
      vi: "   {pn}: Xem chủ đề hiện tại của nhóm"
        + "\n   {pn} <mô tả>: Tạo chủ đề AI và xem xem trước với hình ảnh"
        + "\n   {pn} apply <ID>: Áp dụng chủ đề bằng ID"
        + "\n   Ví dụ: {pn} ocean sunset with purple and pink colors"
        + "\n   Sau đó trả lời tin nhắn với số để chọn chủ đề",
      en: "   {pn}: View current group theme"
        + "\n   {pn} <description>: Create AI theme and preview with images"
        + "\n   {pn} apply <ID>: Apply theme by ID"
        + "\n   Example: {pn} ocean sunset with purple and pink colors"
        + "\n   Then reply to the message with a number to select theme"
    }
  },

  langs: {
    vi: {
      missingPrompt: "!: Vui lòng nhập mô tả cho chủ đề AI hoặc ID chủ đề để áp dụng\n\nVí dụ:\n• {pn} ocean sunset colors\n• {pn} apply 739785333579430",
      generating: "🎨: Đang tạo chủ đề AI, vui lòng chờ...",
      preview: "✨: Đã tạo %1 chủ đề AI!\n\nMô tả: %2\n\n%3\n\n> Trả lời tin nhắn này với số (1-%1) để áp dụng chủ đề",
      themeInfo: "%1. ID: %2\n   Màu gradient: %3\n   Phong cách: AI Generated",
      applying: "🎨: Đang áp dụng chủ đề...",
      applied: "✓: Đã áp dụng chủ đề thành công!",
      error: "×: Đã xảy ra lỗi:\n%1",
      applyError: "×: Đã xảy ra lỗi khi áp dụng chủ đề:\n%1",
      noThemes: "!: Không thể tạo chủ đề với mô tả này, vui lòng thử mô tả khác",
      invalidSelection: "!: Vui lòng nhập số từ 1 đến %1",
      notAuthor: "!: Chỉ người tạo yêu cầu mới có thể chọn chủ đề",
      missingThemeId: "!: Vui lòng nhập ID chủ đề\nVí dụ: {pn} apply 739785333579430",
      applyingById: "🎨: Đang áp dụng chủ đề ID: %1...",
      appliedById: "✓: Đã áp dụng chủ đề ID: %1 thành công!",
      currentTheme: "🎨: Chủ đề hiện tại của nhóm:\n\n📌 Theme ID: %1\n🎨 Màu sắc: %2\n\n> Sử dụng {pn} apply <ID> để thay đổi chủ đề",
      fetchingCurrent: "🔍: Đang lấy thông tin chủ đề hiện tại...",
      noCurrentTheme: "ℹ️: Nhóm này đang dùng chủ đề mặc định",
      showingPreviews: "🖼️: Đang hiển thị xem trước chủ đề (Sáng & Tối)...",
      previousTheme: "📋: Chủ đề trước đó:\n📌 Theme ID: %1\n🎨 Màu sắc: %2"
    },
    en: {
      missingPrompt: "!: Enter a description for AI theme or theme ID to apply\n\nExamples:\n• {pn} ocean sunset colors\n• {pn} apply 739785333579430",
      generating: "Please wait...",
      preview: "✨: Generated %1 AI theme(s)!\n\nDescription: %2\n\n%3\n\n> Reply to this message with a number (1-%1) to apply the theme",
      themeInfo: "%1. ID: %2\n   Gradient Color: %3\n   Style: AI Generated",
      applying: ": Applying theme...",
      applied: "✓: Theme applied !",
      error: "×: An error occurred:\n%1",
      applyError: "×: An error occurred while applying theme:\n%1",
      noThemes: "!: Unable to create theme with this description, please try another description",
      invalidSelection: "!: Enter a number from 1 to %1",
      notAuthor: "!: Only the person who requested can select the theme",
      missingThemeId: "!: Enter theme ID\nExample: {pn} apply 739785333579430",
      applyingById: ": Applying theme ID: %1...",
      appliedById: "✓: applied theme ID: %1!",
      currentTheme: "🎨: Current group theme:\n\n📌 Theme ID: %1\n🎨 Color: %2\n\n> Use {pn} apply <ID> to change theme",
      fetchingCurrent: "🔍: Fetching current theme information...",
      noCurrentTheme: "ℹ️: This group is using the default theme",
      showingPreviews: "🖼️: Showing theme previews...",
      previousTheme: "📋: Previous theme:\n📌 Theme ID: %1\n🎨 Color: %2"
    }
  },

  onStart: async function ({ args, message, event, api, getLang, commandName }) {
    const command = args[0];
    
    if (command === "id") {
      try {
        const threadInfo = await api.getThreadInfo(event.threadID);
        const themeId = threadInfo?.threadTheme?.id || threadInfo?.color || "Unknown";
        return message.reply(`~_~: Current Theme ID: ${themeId}`);
      } catch (error) {
        return message.reply(getLang("error", error.message || error));
      }
    }
    
    if (command === "apply" || command === "set") {
      const themeId = args[1];
      
      if (!themeId) {
        return message.reply(getLang("missingThemeId"));
      }

      try {
        message.reply(getLang("applyingById", themeId));
        await api.changeThreadColor(themeId, event.threadID);
        return message.reply(getLang("appliedById", themeId));
      } catch (error) {
        return message.reply(getLang("applyError", error.message || error));
      }
    }

    const prompt = args.join(" ");

    if (!prompt) {
      try {
        message.reply(getLang("fetchingCurrent"));
        
        const threadInfo = await api.getThreadInfo(event.threadID);
        const theme = threadInfo.threadTheme;
        if (!theme) {
          return message.reply(getLang("noCurrentTheme"));
        }
        
        const themeId = theme.id || theme.theme_fbid || "Unknown";
        let colorInfo = threadInfo.color || theme.accessibility_label || "Unknown";
        
        const attachments = [];
        
        const extractUrl = (obj) => {
          if (!obj) return null;
          if (typeof obj === 'string') return obj;
          return obj.uri || obj.url || null;
        };

        try {
          console.log("Fetching theme details for ID:", themeId);
          const currentThemeData = await api.fetchThemeData(themeId);
          console.log("Theme data fetched:", JSON.stringify(currentThemeData, null, 2));
          
          if (currentThemeData) {
            if (currentThemeData.name) colorInfo = currentThemeData.name;
            
            let imageUrls = [];
            
            if (currentThemeData.backgroundImage) {
              const bgUrl = extractUrl(currentThemeData.backgroundImage);
              console.log(`Current theme background URL: ${bgUrl}`);
              if (bgUrl) {
                imageUrls.push({ url: bgUrl, name: "current_theme_preview.png" });
              }
            }
            
            for (const imgData of imageUrls) {
              try {
                const stream = await getStreamFromURL(imgData.url, imgData.name);
                if (stream) {
                  console.log(`downloaded: ${imgData.name}`);
                  attachments.push(stream);
                }
              } catch (downloadErr) {
                console.error(`Failed to download current theme preview: ${imgData.url}`, downloadErr.message);
              }
            }
          }
        } catch (err) {
          console.error("Failed to fetch theme previews:", err.message);
        }
        
        const messageBody = attachments.length > 0 
          ? getLang("currentTheme", themeId, colorInfo) + "\n\n" + getLang("showingPreviews")
          : getLang("currentTheme", themeId, colorInfo);
        
        try {
          return await message.reply({
            body: messageBody,
            attachment: attachments.length > 0 ? attachments : undefined
          });
        } catch (attachmentError) {
          return message.reply(getLang("currentTheme", themeId, colorInfo));
        }
      } catch (error) {
        return message.reply(getLang("error", error.message || error));
      }
    }

    try {
      message.reply(getLang("generating"));

      const themes = await api.createAITheme(prompt, 5);
      
      console.log("=== THEME DEBUG ===");
      console.log("Themes returned:", themes?.length || 0);
      if (themes && themes.length > 0) {
        console.log("First theme structure:", JSON.stringify(themes[0], null, 2));
      }

      if (!themes || themes.length === 0) {
        return message.reply(getLang("noThemes"));
      }

      let themeList = "";
      const attachments = [];
      
      const extractUrl = (obj) => {
        if (!obj) return null;
        if (typeof obj === 'string') return obj;
        if (obj.uri) return obj.uri;
        if (obj.url) return obj.url;
        return null;
      };
      
      for (let index = 0; index < themes.length; index++) {
        const theme = themes[index];
        let colorInfo = "AI Generated";
        
        if (theme.accessibility_label) {
          colorInfo = theme.accessibility_label;
        } else if (theme.gradient_colors && theme.gradient_colors.length > 0) {
          colorInfo = theme.gradient_colors.join(" → ");
        } else if (theme.primary_color) {
          colorInfo = theme.primary_color;
        }
        
        themeList += getLang("themeInfo", index + 1, theme.id, colorInfo) + "\n\n";
        
        let imageUrls = [];
        
        if (theme.preview_image_urls) {
          const urls = theme.preview_image_urls;
          console.log(`Theme ${index + 1} preview_image_urls:`, urls);
          const lightUrl = extractUrl(urls.light_mode);
          const darkUrl = extractUrl(urls.dark_mode);
          console.log(`Theme ${index + 1} extracted URLs - light: ${lightUrl}, dark: ${darkUrl}`);
          if (lightUrl) imageUrls.push({ url: lightUrl, name: `theme_${index + 1}_light.png` });
          if (darkUrl && darkUrl !== lightUrl) imageUrls.push({ url: darkUrl, name: `theme_${index + 1}_dark.png` });
        }
        
        if (imageUrls.length === 0 && theme.background_asset?.image) {
          const bgUrl = extractUrl(theme.background_asset.image);
          console.log(`Theme ${index + 1} background_asset URL: ${bgUrl}`);
          if (bgUrl) imageUrls.push({ url: bgUrl, name: `theme_${index + 1}_bg.png` });
        }
        
        if (imageUrls.length === 0 && theme.icon_asset?.image) {
          const iconUrl = extractUrl(theme.icon_asset.image);
          console.log(`Theme ${index + 1} icon_asset URL: ${iconUrl}`);
          if (iconUrl) imageUrls.push({ url: iconUrl, name: `theme_${index + 1}_icon.png` });
        }
        
        if (imageUrls.length === 0 && theme.alternative_themes?.length > 0) {
          for (const altTheme of theme.alternative_themes) {
            if (altTheme.background_asset?.image) {
              const altUrl = extractUrl(altTheme.background_asset.image);
              console.log(`Theme ${index + 1} alternative theme URL: ${altUrl}`);
              if (altUrl) {
                imageUrls.push({ url: altUrl, name: `theme_${index + 1}_alt.png` });
                break;
              }
            }
          }
        }
        
        console.log(`Theme ${index + 1} total image URLs to download: ${imageUrls.length}`);
        
        for (const imgData of imageUrls) {
          try {
            console.log(`Downloading: ${imgData.url}`);
            const stream = await getStreamFromURL(imgData.url, imgData.name);
            if (stream) {
              console.log(`downloaded: ${imgData.name}`);
              attachments.push(stream);
            } else {
              console.log(`Stream is null for: ${imgData.name}`);
            }
          } catch (err) {
            console.error(`Failed to download theme preview: ${imgData.url}`, err.message);
          }
        }
      }

      const replyMessage = getLang("preview", themes.length, prompt, themeList.trim());
      
      // Try sending with attachments first
      message.reply({ 
        body: replyMessage,
        attachment: attachments.length > 0 ? attachments : undefined
      }, (err, info) => {
        if (err) {
          // If sending with attachments failed, retry without them
          message.reply(replyMessage, (retryErr, retryInfo) => {
            if (retryErr) return;
            global.GoatBot.onReply.set(retryInfo.messageID, {
              commandName,
              messageID: retryInfo.messageID,
              author: event.senderID,
              themes: themes,
              prompt: prompt
            });
          });
          return;
        }
        
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          messageID: info.messageID,
          author: event.senderID,
          themes: themes,
          prompt: prompt
        });
      });

    } catch (error) {
      message.reply(getLang("error", error.message || JSON.stringify(error)));
    }
  },

  onReply: async function ({ message, Reply, event, api, getLang }) {
    const { author, themes, messageID } = Reply;
    
    if (event.senderID !== author) {
      return message.reply(getLang("notAuthor"));
    }

    const selection = parseInt(event.body.trim());
    
    if (isNaN(selection) || selection < 1 || selection > themes.length) {
      return message.reply(getLang("invalidSelection", themes.length));
    }

    const selectedTheme = themes[selection - 1];
    
    try {
      // Get current theme before applying new one
      const threadInfo = await api.getThreadInfo(event.threadID);
      const currentTheme = threadInfo.threadTheme;
      const currentThemeId = currentTheme?.id || currentTheme?.theme_fbid || "Default";
      const currentColor = threadInfo.color || currentTheme?.accessibility_label || "Default";
      
      message.reply(getLang("applying"));
      await api.changeThreadColor(selectedTheme.id, event.threadID);
      
      // Show previous theme info with success message
      const successMsg = getLang("applied") + "\n\n" + getLang("previousTheme", currentThemeId, currentColor);
      message.reply(successMsg);
      
      api.unsendMessage(messageID);
    } catch (error) {
      message.reply(getLang("applyError", error.message || error));
    }
  }
};
