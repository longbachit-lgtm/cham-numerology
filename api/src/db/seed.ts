// seed.ts (hoặc seed.js nếu bạn không dùng TS)
import pool from "./connection";

async function seed() {
  const client = await pool.connect();
  try {
    console.log("🌱 Seeding database...");

    // (tùy chọn) đảm bảo có unique index cho ON CONFLICT
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes 
          WHERE schemaname = 'public' AND indexname = 'content_templates_unique_uk'
        ) THEN
          CREATE UNIQUE INDEX content_templates_unique_uk
          ON content_templates (scope, number, lang, "key");
        END IF;
      END $$;
    `);

    await client.query("BEGIN");

    const templates = [
      // Number 1 - English
      { scope: "day", number: "1", lang: "en", key: "title", body: "Energy of New Beginnings" },
      { scope: "day", number: "1", lang: "en", key: "keywords", body: "Leadership, Independence, Innovation, Pioneering" },
      { scope: "day", number: "1", lang: "en", key: "challenges", body: "May face challenges with patience and teamwork" },
      { scope: "day", number: "1", lang: "en", key: "opportunities", body: "Excellent time to start new projects and express yourself" },
      { scope: "day", number: "1", lang: "en", key: "quick_tip", body: "Trust your instincts and dare to step out of your comfort zone" },
      { scope: "day", number: "1", lang: "en", key: "mistakes_to_avoid", body: "Don't be too stubborn or ignore others' opinions" },
      { scope: "day", number: "1", lang: "en", key: "actions_morning", body: "Plan a new project or creative idea" },
      { scope: "day", number: "1", lang: "en", key: "actions_noon", body: "Take the first step of your plan, even if small" },
      { scope: "day", number: "1", lang: "en", key: "actions_afternoon", body: "Share ideas with others to get feedback" },
      { scope: "day", number: "1", lang: "en", key: "actions_night", body: "Review what you've achieved and adjust your plan" },
      { scope: "day", number: "1", lang: "en", key: "affirmation", body: "I am a pioneer, I dare to take action" },
      { scope: "day", number: "1", lang: "en", key: "quote", body: "A journey of a thousand miles begins with a single step" },

      // Number 2 - English
      { scope: "day", number: "2", lang: "en", key: "title", body: "Energy of Cooperation" },
      { scope: "day", number: "2", lang: "en", key: "keywords", body: "Cooperation, Balance, Sensitivity, Harmony" },
      { scope: "day", number: "2", lang: "en", key: "challenges", body: "May be overly sensitive or dependent on others" },
      { scope: "day", number: "2", lang: "en", key: "opportunities", body: "Great time to build relationships and work in teams" },
      { scope: "day", number: "2", lang: "en", key: "quick_tip", body: "Listen more than you speak, find common ground with others" },
      { scope: "day", number: "2", lang: "en", key: "mistakes_to_avoid", body: "Don't sacrifice too much of your personal needs for others" },
      { scope: "day", number: "2", lang: "en", key: "actions_morning", body: "Reach out to someone for collaboration or conflict resolution" },
      { scope: "day", number: "2", lang: "en", key: "actions_noon", body: "Join group activities, contribute constructive ideas" },
      { scope: "day", number: "2", lang: "en", key: "actions_afternoon", body: "Spend time nurturing important relationships" },
      { scope: "day", number: "2", lang: "en", key: "actions_night", body: "Practice meditation or yoga to balance your energy" },
      { scope: "day", number: "2", lang: "en", key: "affirmation", body: "I find strength in connection" },
      { scope: "day", number: "2", lang: "en", key: "quote", body: "If you want to go fast, go alone. If you want to go far, go together" },

      // Number 3 - English
      { scope: "day", number: "3", lang: "en", key: "title", body: "Energy of Creativity" },
      { scope: "day", number: "3", lang: "en", key: "keywords", body: "Creativity, Communication, Joy, Expression" },
      { scope: "day", number: "3", lang: "en", key: "challenges", body: "May get easily distracted, lack focus on one thing" },
      { scope: "day", number: "3", lang: "en", key: "opportunities", body: "Perfect day for creativity, socializing and fun" },
      { scope: "day", number: "3", lang: "en", key: "quick_tip", body: "Let your imagination soar, don't limit yourself" },
      { scope: "day", number: "3", lang: "en", key: "mistakes_to_avoid", body: "Don't talk too much or promise what you can't deliver" },
      { scope: "day", number: "3", lang: "en", key: "actions_morning", body: "Write in a journal or draw to express emotions" },
      { scope: "day", number: "3", lang: "en", key: "actions_noon", body: "Chat with friends, share interesting stories" },
      { scope: "day", number: "3", lang: "en", key: "actions_afternoon", body: "Engage in artistic activities or entertainment" },
      { scope: "day", number: "3", lang: "en", key: "actions_night", body: "Watch movies, read books or listen to music to relax" },
      { scope: "day", number: "3", lang: "en", key: "affirmation", body: "I freely express myself authentically" },
      { scope: "day", number: "3", lang: "en", key: "quote", body: "Creativity is intelligence having fun" },

      // Number 9 - English
      { scope: "day", number: "9", lang: "en", key: "title", body: "Energy of Completion" },
      { scope: "day", number: "9", lang: "en", key: "keywords", body: "Completion, Gratitude, Forgiveness, Humanity" },
      { scope: "day", number: "9", lang: "en", key: "challenges", body: "May feel tired or sad when things end" },
      { scope: "day", number: "9", lang: "en", key: "opportunities", body: "Time to close cycles and prepare for new beginnings" },
      { scope: "day", number: "9", lang: "en", key: "quick_tip", body: "Be grateful for what you have and forgive to move forward" },
      { scope: "day", number: "9", lang: "en", key: "mistakes_to_avoid", body: "Don't cling to the past or what no longer serves you" },
      { scope: "day", number: "9", lang: "en", key: "actions_morning", body: "Write a list of things you're grateful for" },
      { scope: "day", number: "9", lang: "en", key: "actions_noon", body: "Complete unfinished work" },
      { scope: "day", number: "9", lang: "en", key: "actions_afternoon", body: "Help others or do charity work" },
      { scope: "day", number: "9", lang: "en", key: "actions_night", body: "Meditate to let go and prepare for new cycles" },
      { scope: "day", number: "9", lang: "en", key: "affirmation", body: "I am grateful and ready for new beginnings" },
      { scope: "day", number: "9", lang: "en", key: "quote", body: "Every ending is a new beginning" },

      // Number 1 - Vietnamese (keeping original)
      { scope: "day", number: "1", lang: "vi", key: "title", body: "Năng Lượng Khởi Đầu" },
      { scope: "day", number: "1", lang: "vi", key: "keywords", body: "Khởi đầu, Độc lập, Lãnh đạo, Sáng tạo" },
      { scope: "day", number: "1", lang: "vi", key: "challenges", body: "Có thể gặp thách thức về sự kiên nhẫn và làm việc nhóm" },
      { scope: "day", number: "1", lang: "vi", key: "opportunities", body: "Cơ hội tuyệt vời để bắt đầu dự án mới, thể hiện bản thân" },
      { scope: "day", number: "1", lang: "vi", key: "quick_tip", body: "Hãy tin vào bản năng của bạn và dám bước ra khỏi vùng an toàn" },
      { scope: "day", number: "1", lang: "vi", key: "mistakes_to_avoid", body: "Đừng quá cứng đầu hoặc bỏ qua ý kiến người khác" },
      { scope: "day", number: "1", lang: "vi", key: "actions_morning", body: "Lập kế hoạch cho một dự án mới hoặc ý tưởng sáng tạo" },
      { scope: "day", number: "1", lang: "vi", key: "actions_noon", body: "Thực hiện bước đầu tiên của kế hoạch, dù nhỏ" },
      { scope: "day", number: "1", lang: "vi", key: "actions_afternoon", body: "Chia sẻ ý tưởng với người khác để nhận phản hồi" },
      { scope: "day", number: "1", lang: "vi", key: "actions_night", body: "Ghi chép lại những gì đã đạt được và điều chỉnh kế hoạch" },
      { scope: "day", number: "1", lang: "vi", key: "affirmation", body: "Tôi là người tiên phong, tôi dám bước đi" },
      { scope: "day", number: "1", lang: "vi", key: "quote", body: "Hành trình ngàn dặm bắt đầu từ một bước chân" },

      // Number 2 - Vietnamese
      { scope: "day", number: "2", lang: "vi", key: "title", body: "Năng Lượng Hợp Tác" },
      { scope: "day", number: "2", lang: "vi", key: "keywords", body: "Hợp tác, Cân bằng, Nhạy cảm, Hòa giải" },
      { scope: "day", number: "2", lang: "vi", key: "challenges", body: "Có thể quá nhạy cảm hoặc phụ thuộc vào người khác" },
      { scope: "day", number: "2", lang: "vi", key: "opportunities", body: "Thời điểm tốt để xây dựng mối quan hệ và làm việc nhóm" },
      { scope: "day", number: "2", lang: "vi", key: "quick_tip", body: "Lắng nghe nhiều hơn nói, tìm điểm chung với người khác" },
      { scope: "day", number: "2", lang: "vi", key: "mistakes_to_avoid", body: "Đừng hy sinh quá nhiều nhu cầu cá nhân vì người khác" },
      { scope: "day", number: "2", lang: "vi", key: "actions_morning", body: "Liên hệ với ai đó để hợp tác hoặc giải quyết mâu thuẫn" },
      { scope: "day", number: "2", lang: "vi", key: "actions_noon", body: "Tham gia hoạt động nhóm, đóng góp ý kiến xây dựng" },
      { scope: "day", number: "2", lang: "vi", key: "actions_afternoon", body: "Dành thời gian chăm sóc mối quan hệ quan trọng" },
      { scope: "day", number: "2", lang: "vi", key: "actions_night", body: "Thiền hoặc yoga để cân bằng năng lượng" },
      { scope: "day", number: "2", lang: "vi", key: "affirmation", body: "Tôi tìm thấy sức mạnh trong sự kết nối" },
      { scope: "day", number: "2", lang: "vi", key: "quote", body: "Một mình đi nhanh, cùng nhau đi xa" },

      // Number 3 - Vietnamese
      { scope: "day", number: "3", lang: "vi", key: "title", body: "Năng Lượng Sáng Tạo" },
      { scope: "day", number: "3", lang: "vi", key: "keywords", body: "Sáng tạo, Giao tiếp, Vui vẻ, Biểu đạt" },
      { scope: "day", number: "3", lang: "vi", key: "challenges", body: "Dễ bị phân tán, thiếu tập trung vào một việc" },
      { scope: "day", number: "3", lang: "vi", key: "opportunities", body: "Ngày tuyệt vời để sáng tạo, giao lưu và vui chơi" },
      { scope: "day", number: "3", lang: "vi", key: "quick_tip", body: "Hãy để trí tưởng tượng bay bổng, đừng tự giới hạn" },
      { scope: "day", number: "3", lang: "vi", key: "mistakes_to_avoid", body: "Đừng nói quá nhiều hoặc hứa hẹn điều không thể thực hiện" },
      { scope: "day", number: "3", lang: "vi", key: "actions_morning", body: "Viết nhật ký hoặc vẽ để thể hiện cảm xúc" },
      { scope: "day", number: "3", lang: "vi", key: "actions_noon", body: "Trò chuyện với bạn bè, chia sẻ câu chuyện thú vị" },
      { scope: "day", number: "3", lang: "vi", key: "actions_afternoon", body: "Tham gia hoạt động nghệ thuật hoặc giải trí" },
      { scope: "day", number: "3", lang: "vi", key: "actions_night", body: "Xem phim, đọc sách hoặc nghe nhạc để thư giãn" },
      { scope: "day", number: "3", lang: "vi", key: "affirmation", body: "Tôi tự do thể hiện bản thân một cách chân thật" },
      { scope: "day", number: "3", lang: "vi", key: "quote", body: "Sáng tạo là trí thông minh đang vui chơi" },

      // Number 9 - Vietnamese
      { scope: "day", number: "9", lang: "vi", key: "title", body: "Năng Lượng Hoàn Thành" },
      { scope: "day", number: "9", lang: "vi", key: "keywords", body: "Hoàn thành, Biết ơn, Tha thứ, Nhân văn" },
      { scope: "day", number: "9", lang: "vi", key: "challenges", body: "Có thể cảm thấy mệt mỏi hoặc buồn bã khi kết thúc" },
      { scope: "day", number: "9", lang: "vi", key: "opportunities", body: "Thời điểm để khép lại chu kỳ và chuẩn bị cho điều mới" },
      { scope: "day", number: "9", lang: "vi", key: "quick_tip", body: "Hãy biết ơn những gì đã có và tha thứ để tiến lên" },
      { scope: "day", number: "9", lang: "vi", key: "mistakes_to_avoid", body: "Đừng bám víu vào quá khứ hoặc những gì không còn phù hợp" },
      { scope: "day", number: "9", lang: "vi", key: "actions_morning", body: "Viết danh sách những điều biết ơn" },
      { scope: "day", number: "9", lang: "vi", key: "actions_noon", body: "Hoàn thành công việc đang dang dở" },
      { scope: "day", number: "9", lang: "vi", key: "actions_afternoon", body: "Giúp đỡ người khác hoặc làm từ thiện" },
      { scope: "day", number: "9", lang: "vi", key: "actions_night", body: "Thiền để buông bỏ và chuẩn bị cho chu kỳ mới" },
      { scope: "day", number: "9", lang: "vi", key: "affirmation", body: "Tôi biết ơn và sẵn sàng cho điều mới" },
      { scope: "day", number: "9", lang: "vi", key: "quote", body: "Mỗi kết thúc là một khởi đầu mới" },
    ];

    for (const t of templates) {
      await client.query(
        `INSERT INTO content_templates (scope, number, lang, "key", body)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (scope, number, lang, "key") DO UPDATE SET body = EXCLUDED.body`,
        [t.scope, t.number, t.lang, t.key, t.body]
      );
    }

    await client.query("COMMIT");
    console.log(`✅ Seeded ${templates.length} content templates`);
    console.log("✅ Database seeded successfully");
    process.exit(0);
  } catch (error) {
    await (async () => {
      try { await client.query("ROLLBACK"); } catch {}
    })();
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    client.release();
  }
}

seed();
