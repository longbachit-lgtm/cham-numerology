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

      // Number 4 - English
      { scope: "day", number: "4", lang: "en", key: "title", body: "Energy of Stability" },
      { scope: "day", number: "4", lang: "en", key: "keywords", body: "Stability, Structure, Foundation, Discipline" },
      { scope: "day", number: "4", lang: "en", key: "challenges", body: "May feel stuck in routine or too rigid" },
      { scope: "day", number: "4", lang: "en", key: "opportunities", body: "Perfect time to organize, plan and build solid foundations" },
      { scope: "day", number: "4", lang: "en", key: "quick_tip", body: "Focus on practical tasks and create a structured plan" },
      { scope: "day", number: "4", lang: "en", key: "mistakes_to_avoid", body: "Don't be overly stubborn or resist necessary changes" },
      { scope: "day", number: "4", lang: "en", key: "actions_morning", body: "Create a to-do list and prioritize tasks" },
      { scope: "day", number: "4", lang: "en", key: "actions_noon", body: "Work steadily on important projects" },
      { scope: "day", number: "4", lang: "en", key: "actions_afternoon", body: "Organize workspace or handle administrative tasks" },
      { scope: "day", number: "4", lang: "en", key: "actions_night", body: "Review progress and plan for tomorrow" },
      { scope: "day", number: "4", lang: "en", key: "affirmation", body: "I build a solid foundation for my future" },
      { scope: "day", number: "4", lang: "en", key: "quote", body: "Rome wasn't built in a day, but they were laying bricks every hour" },

      // Number 5 - English
      { scope: "day", number: "5", lang: "en", key: "title", body: "Energy of Freedom" },
      { scope: "day", number: "5", lang: "en", key: "keywords", body: "Freedom, Change, Adventure, Versatility" },
      { scope: "day", number: "5", lang: "en", key: "challenges", body: "May feel restless or make impulsive decisions" },
      { scope: "day", number: "5", lang: "en", key: "opportunities", body: "Great day to try new things and embrace change" },
      { scope: "day", number: "5", lang: "en", key: "quick_tip", body: "Be open to unexpected opportunities and adventures" },
      { scope: "day", number: "5", lang: "en", key: "mistakes_to_avoid", body: "Don't scatter your energy or avoid responsibilities" },
      { scope: "day", number: "5", lang: "en", key: "actions_morning", body: "Try something new or break from routine" },
      { scope: "day", number: "5", lang: "en", key: "actions_noon", body: "Explore new places or meet new people" },
      { scope: "day", number: "5", lang: "en", key: "actions_afternoon", body: "Take a spontaneous adventure or learn something new" },
      { scope: "day", number: "5", lang: "en", key: "actions_night", body: "Reflect on what changes you want to make" },
      { scope: "day", number: "5", lang: "en", key: "affirmation", body: "I embrace change and welcome new experiences" },
      { scope: "day", number: "5", lang: "en", key: "quote", body: "Life begins at the end of your comfort zone" },

      // Number 6 - English
      { scope: "day", number: "6", lang: "en", key: "title", body: "Energy of Love" },
      { scope: "day", number: "6", lang: "en", key: "keywords", body: "Love, Harmony, Responsibility, Service" },
      { scope: "day", number: "6", lang: "en", key: "challenges", body: "May become overly responsible or neglect self-care" },
      { scope: "day", number: "6", lang: "en", key: "opportunities", body: "Perfect day for nurturing relationships and helping others" },
      { scope: "day", number: "6", lang: "en", key: "quick_tip", body: "Balance caring for others with caring for yourself" },
      { scope: "day", number: "6", lang: "en", key: "mistakes_to_avoid", body: "Don't martyr yourself or be too controlling" },
      { scope: "day", number: "6", lang: "en", key: "actions_morning", body: "Reach out to family or loved ones" },
      { scope: "day", number: "6", lang: "en", key: "actions_noon", body: "Do something kind for someone" },
      { scope: "day", number: "6", lang: "en", key: "actions_afternoon", body: "Create beauty or harmony in your environment" },
      { scope: "day", number: "6", lang: "en", key: "actions_night", body: "Spend quality time with family or practice self-care" },
      { scope: "day", number: "6", lang: "en", key: "affirmation", body: "I give and receive love freely" },
      { scope: "day", number: "6", lang: "en", key: "quote", body: "Love is not what you say, but what you do" },

      // Number 7 - English
      { scope: "day", number: "7", lang: "en", key: "title", body: "Energy of Wisdom" },
      { scope: "day", number: "7", lang: "en", key: "keywords", body: "Spirituality, Wisdom, Analysis, Introspection" },
      { scope: "day", number: "7", lang: "en", key: "challenges", body: "May feel isolated or overthink things" },
      { scope: "day", number: "7", lang: "en", key: "opportunities", body: "Perfect day for reflection, study and spiritual growth" },
      { scope: "day", number: "7", lang: "en", key: "quick_tip", body: "Trust your intuition and seek inner wisdom" },
      { scope: "day", number: "7", lang: "en", key: "mistakes_to_avoid", body: "Don't become too detached or cynical" },
      { scope: "day", number: "7", lang: "en", key: "actions_morning", body: "Meditate or spend time in quiet reflection" },
      { scope: "day", number: "7", lang: "en", key: "actions_noon", body: "Study, research or deepen your knowledge" },
      { scope: "day", number: "7", lang: "en", key: "actions_afternoon", body: "Spend time in nature or practice mindfulness" },
      { scope: "day", number: "7", lang: "en", key: "actions_night", body: "Journal your insights or read spiritual texts" },
      { scope: "day", number: "7", lang: "en", key: "affirmation", body: "I trust my inner wisdom and intuition" },
      { scope: "day", number: "7", lang: "en", key: "quote", body: "The quieter you become, the more you can hear" },

      // Number 8 - English
      { scope: "day", number: "8", lang: "en", key: "title", body: "Energy of Power" },
      { scope: "day", number: "8", lang: "en", key: "keywords", body: "Power, Success, Abundance, Achievement" },
      { scope: "day", number: "8", lang: "en", key: "challenges", body: "May become too focused on material success" },
      { scope: "day", number: "8", lang: "en", key: "opportunities", body: "Excellent day for business, finance and goal achievement" },
      { scope: "day", number: "8", lang: "en", key: "quick_tip", body: "Think big and take action towards your goals" },
      { scope: "day", number: "8", lang: "en", key: "mistakes_to_avoid", body: "Don't be ruthless or sacrifice integrity for success" },
      { scope: "day", number: "8", lang: "en", key: "actions_morning", body: "Set ambitious goals and create an action plan" },
      { scope: "day", number: "8", lang: "en", key: "actions_noon", body: "Network or pursue business opportunities" },
      { scope: "day", number: "8", lang: "en", key: "actions_afternoon", body: "Work on projects that increase your value" },
      { scope: "day", number: "8", lang: "en", key: "actions_night", body: "Review finances and visualize success" },
      { scope: "day", number: "8", lang: "en", key: "affirmation", body: "I am powerful and successful in all I do" },
      { scope: "day", number: "8", lang: "en", key: "quote", body: "Success is not final, failure is not fatal: it is the courage to continue that counts" },

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

      // Number 10 - English
      { scope: "day", number: "10", lang: "en", key: "title", body: "Energy of New Cycles" },
      { scope: "day", number: "10", lang: "en", key: "keywords", body: "Leadership, Completion, New Beginning, Confidence" },
      { scope: "day", number: "10", lang: "en", key: "challenges", body: "May feel pressure to start fresh or lead" },
      { scope: "day", number: "10", lang: "en", key: "opportunities", body: "Perfect day to initiate new cycles and take charge" },
      { scope: "day", number: "10", lang: "en", key: "quick_tip", body: "Combine the courage of 1 with the wisdom of completion" },
      { scope: "day", number: "10", lang: "en", key: "mistakes_to_avoid", body: "Don't rush into things without learning from the past" },
      { scope: "day", number: "10", lang: "en", key: "actions_morning", body: "Set intentions for new beginnings" },
      { scope: "day", number: "10", lang: "en", key: "actions_noon", body: "Take bold action on fresh opportunities" },
      { scope: "day", number: "10", lang: "en", key: "actions_afternoon", body: "Apply past lessons to new situations" },
      { scope: "day", number: "10", lang: "en", key: "actions_night", body: "Celebrate progress and envision the future" },
      { scope: "day", number: "10", lang: "en", key: "affirmation", body: "I embrace new beginnings with wisdom and courage" },
      { scope: "day", number: "10", lang: "en", key: "quote", body: "Every moment is a fresh beginning" },

      // Number 11 - English
      { scope: "day", number: "11", lang: "en", key: "title", body: "Energy of Spiritual Awakening" },
      { scope: "day", number: "11", lang: "en", key: "keywords", body: "Intuition, Inspiration, Spirituality, Illumination" },
      { scope: "day", number: "11", lang: "en", key: "challenges", body: "May feel overwhelmed by heightened sensitivity" },
      { scope: "day", number: "11", lang: "en", key: "opportunities", body: "Exceptional day for spiritual insight and inspiration" },
      { scope: "day", number: "11", lang: "en", key: "quick_tip", body: "Trust your intuition, it's especially strong today" },
      { scope: "day", number: "11", lang: "en", key: "mistakes_to_avoid", body: "Don't ignore your spiritual guidance or intuitive hits" },
      { scope: "day", number: "11", lang: "en", key: "actions_morning", body: "Practice deep meditation or spiritual rituals" },
      { scope: "day", number: "11", lang: "en", key: "actions_noon", body: "Follow your intuitive guidance in decisions" },
      { scope: "day", number: "11", lang: "en", key: "actions_afternoon", body: "Inspire others or share your spiritual insights" },
      { scope: "day", number: "11", lang: "en", key: "actions_night", body: "Record dreams and intuitive messages" },
      { scope: "day", number: "11", lang: "en", key: "affirmation", body: "I am connected to divine wisdom and inspiration" },
      { scope: "day", number: "11", lang: "en", key: "quote", body: "Your intuition is your superpower" },

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

      // Number 4 - Vietnamese
      { scope: "day", number: "4", lang: "vi", key: "title", body: "Năng Lượng Ổn Định" },
      { scope: "day", number: "4", lang: "vi", key: "keywords", body: "Ổn định, Cấu trúc, Nền tảng, Kỷ luật" },
      { scope: "day", number: "4", lang: "vi", key: "challenges", body: "Có thể cảm thấy bị mắc kẹt trong thói quen hoặc quá cứng nhắc" },
      { scope: "day", number: "4", lang: "vi", key: "opportunities", body: "Thời điểm hoàn hảo để tổ chức, lập kế hoạch và xây dựng nền tảng vững chắc" },
      { scope: "day", number: "4", lang: "vi", key: "quick_tip", body: "Tập trung vào các nhiệm vụ thực tế và tạo kế hoạch có cấu trúc" },
      { scope: "day", number: "4", lang: "vi", key: "mistakes_to_avoid", body: "Đừng quá bảo thủ hoặc chống lại những thay đổi cần thiết" },
      { scope: "day", number: "4", lang: "vi", key: "actions_morning", body: "Tạo danh sách công việc và sắp xếp thứ tự ưu tiên" },
      { scope: "day", number: "4", lang: "vi", key: "actions_noon", body: "Làm việc đều đặn trên các dự án quan trọng" },
      { scope: "day", number: "4", lang: "vi", key: "actions_afternoon", body: "Sắp xếp không gian làm việc hoặc xử lý công việc hành chính" },
      { scope: "day", number: "4", lang: "vi", key: "actions_night", body: "Xem xét tiến độ và lập kế hoạch cho ngày mai" },
      { scope: "day", number: "4", lang: "vi", key: "affirmation", body: "Tôi xây dựng nền tảng vững chắc cho tương lai" },
      { scope: "day", number: "4", lang: "vi", key: "quote", body: "Thành Rome không được xây trong một ngày, nhưng họ đặt từng viên gạch mỗi giờ" },

      // Number 5 - Vietnamese
      { scope: "day", number: "5", lang: "vi", key: "title", body: "Năng Lượng Tự Do" },
      { scope: "day", number: "5", lang: "vi", key: "keywords", body: "Tự do, Thay đổi, Phiêu lưu, Linh hoạt" },
      { scope: "day", number: "5", lang: "vi", key: "challenges", body: "Có thể cảm thấy bồn chồn hoặc đưa ra quyết định bốc đồng" },
      { scope: "day", number: "5", lang: "vi", key: "opportunities", body: "Ngày tuyệt vời để thử điều mới và đón nhận thay đổi" },
      { scope: "day", number: "5", lang: "vi", key: "quick_tip", body: "Hãy cởi mở với những cơ hội và cuộc phiêu lưu bất ngờ" },
      { scope: "day", number: "5", lang: "vi", key: "mistakes_to_avoid", body: "Đừng phân tán năng lượng hoặc trốn tránh trách nhiệm" },
      { scope: "day", number: "5", lang: "vi", key: "actions_morning", body: "Thử điều gì đó mới hoặc phá vỡ thói quen" },
      { scope: "day", number: "5", lang: "vi", key: "actions_noon", body: "Khám phá địa điểm mới hoặc gặp gỡ người mới" },
      { scope: "day", number: "5", lang: "vi", key: "actions_afternoon", body: "Tham gia cuộc phiêu lưu tự phát hoặc học điều mới" },
      { scope: "day", number: "5", lang: "vi", key: "actions_night", body: "Suy ngẫm về những thay đổi bạn muốn thực hiện" },
      { scope: "day", number: "5", lang: "vi", key: "affirmation", body: "Tôi đón nhận thay đổi và chào đón trải nghiệm mới" },
      { scope: "day", number: "5", lang: "vi", key: "quote", body: "Cuộc sống bắt đầu ở nơi vùng an toàn kết thúc" },

      // Number 6 - Vietnamese
      { scope: "day", number: "6", lang: "vi", key: "title", body: "Năng Lượng Tình Yêu" },
      { scope: "day", number: "6", lang: "vi", key: "keywords", body: "Tình yêu, Hòa hợp, Trách nhiệm, Phục vụ" },
      { scope: "day", number: "6", lang: "vi", key: "challenges", body: "Có thể trở nên quá có trách nhiệm hoặc bỏ bê việc chăm sóc bản thân" },
      { scope: "day", number: "6", lang: "vi", key: "opportunities", body: "Ngày hoàn hảo để nuôi dưỡng mối quan hệ và giúp đỡ người khác" },
      { scope: "day", number: "6", lang: "vi", key: "quick_tip", body: "Cân bằng giữa việc chăm sóc người khác và bản thân" },
      { scope: "day", number: "6", lang: "vi", key: "mistakes_to_avoid", body: "Đừng hi sinh bản thân quá mức hoặc kiểm soát quá nhiều" },
      { scope: "day", number: "6", lang: "vi", key: "actions_morning", body: "Liên lạc với gia đình hoặc người thân yêu" },
      { scope: "day", number: "6", lang: "vi", key: "actions_noon", body: "Làm điều tử tế cho ai đó" },
      { scope: "day", number: "6", lang: "vi", key: "actions_afternoon", body: "Tạo ra vẻ đẹp hoặc sự hài hòa trong môi trường" },
      { scope: "day", number: "6", lang: "vi", key: "actions_night", body: "Dành thời gian chất lượng với gia đình hoặc chăm sóc bản thân" },
      { scope: "day", number: "6", lang: "vi", key: "affirmation", body: "Tôi cho và nhận tình yêu một cách tự do" },
      { scope: "day", number: "6", lang: "vi", key: "quote", body: "Tình yêu không phải là những gì bạn nói, mà là những gì bạn làm" },

      // Number 7 - Vietnamese
      { scope: "day", number: "7", lang: "vi", key: "title", body: "Năng Lượng Trí Tuệ" },
      { scope: "day", number: "7", lang: "vi", key: "keywords", body: "Tâm linh, Trí tuệ, Phân tích, Nội tâm" },
      { scope: "day", number: "7", lang: "vi", key: "challenges", body: "Có thể cảm thấy cô đơn hoặc suy nghĩ quá nhiều" },
      { scope: "day", number: "7", lang: "vi", key: "opportunities", body: "Ngày hoàn hảo để suy ngẫm, học tập và phát triển tâm linh" },
      { scope: "day", number: "7", lang: "vi", key: "quick_tip", body: "Tin tưởng trực giác và tìm kiếm trí tuệ nội tâm" },
      { scope: "day", number: "7", lang: "vi", key: "mistakes_to_avoid", body: "Đừng trở nên quá xa cách hoặc hoài nghi" },
      { scope: "day", number: "7", lang: "vi", key: "actions_morning", body: "Thiền định hoặc dành thời gian cho suy ngẫm yên tĩnh" },
      { scope: "day", number: "7", lang: "vi", key: "actions_noon", body: "Học tập, nghiên cứu hoặc mở rộng kiến thức" },
      { scope: "day", number: "7", lang: "vi", key: "actions_afternoon", body: "Dành thời gian trong thiên nhiên hoặc thực hành chánh niệm" },
      { scope: "day", number: "7", lang: "vi", key: "actions_night", body: "Ghi chép hiểu biết của bạn hoặc đọc sách tâm linh" },
      { scope: "day", number: "7", lang: "vi", key: "affirmation", body: "Tôi tin tưởng trí tuệ và trực giác nội tâm" },
      { scope: "day", number: "7", lang: "vi", key: "quote", body: "Càng yên tĩnh, bạn càng nghe rõ hơn" },

      // Number 8 - Vietnamese
      { scope: "day", number: "8", lang: "vi", key: "title", body: "Năng Lượng Quyền Lực" },
      { scope: "day", number: "8", lang: "vi", key: "keywords", body: "Quyền lực, Thành công, Thịnh vượng, Thành tựu" },
      { scope: "day", number: "8", lang: "vi", key: "challenges", body: "Có thể tập trung quá nhiều vào thành công vật chất" },
      { scope: "day", number: "8", lang: "vi", key: "opportunities", body: "Ngày xuất sắc cho kinh doanh, tài chính và đạt mục tiêu" },
      { scope: "day", number: "8", lang: "vi", key: "quick_tip", body: "Nghĩ lớn và hành động hướng tới mục tiêu" },
      { scope: "day", number: "8", lang: "vi", key: "mistakes_to_avoid", body: "Đừng tàn nhẫn hoặc hi sinh sự chính trực vì thành công" },
      { scope: "day", number: "8", lang: "vi", key: "actions_morning", body: "Đặt mục tiêu đầy tham vọng và tạo kế hoạch hành động" },
      { scope: "day", number: "8", lang: "vi", key: "actions_noon", body: "Mở rộng mạng lưới hoặc theo đuổi cơ hội kinh doanh" },
      { scope: "day", number: "8", lang: "vi", key: "actions_afternoon", body: "Làm việc trên các dự án tăng giá trị của bạn" },
      { scope: "day", number: "8", lang: "vi", key: "actions_night", body: "Xem xét tài chính và hình dung thành công" },
      { scope: "day", number: "8", lang: "vi", key: "affirmation", body: "Tôi mạnh mẽ và thành công trong mọi điều tôi làm" },
      { scope: "day", number: "8", lang: "vi", key: "quote", body: "Thành công không phải là đích cuối, thất bại không phải là định mệnh" },

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

      // Number 10 - Vietnamese
      { scope: "day", number: "10", lang: "vi", key: "title", body: "Năng Lượng Chu Kỳ Mới" },
      { scope: "day", number: "10", lang: "vi", key: "keywords", body: "Lãnh đạo, Hoàn thành, Khởi đầu mới, Tự tin" },
      { scope: "day", number: "10", lang: "vi", key: "challenges", body: "Có thể cảm thấy áp lực phải bắt đầu mới hoặc dẫn dắt" },
      { scope: "day", number: "10", lang: "vi", key: "opportunities", body: "Ngày hoàn hảo để khởi đầu chu kỳ mới và nắm quyền chủ động" },
      { scope: "day", number: "10", lang: "vi", key: "quick_tip", body: "Kết hợp lòng dũng cảm của số 1 với trí tuệ của sự hoàn thành" },
      { scope: "day", number: "10", lang: "vi", key: "mistakes_to_avoid", body: "Đừng vội vã mà không học hỏi từ quá khứ" },
      { scope: "day", number: "10", lang: "vi", key: "actions_morning", body: "Đặt ý định cho những khởi đầu mới" },
      { scope: "day", number: "10", lang: "vi", key: "actions_noon", body: "Hành động táo bạo với những cơ hội mới" },
      { scope: "day", number: "10", lang: "vi", key: "actions_afternoon", body: "Áp dụng bài học từ quá khứ vào tình huống mới" },
      { scope: "day", number: "10", lang: "vi", key: "actions_night", body: "Ăn mừng tiến bộ và hình dung tương lai" },
      { scope: "day", number: "10", lang: "vi", key: "affirmation", body: "Tôi đón nhận khởi đầu mới với trí tuệ và lòng dũng cảm" },
      { scope: "day", number: "10", lang: "vi", key: "quote", body: "Mỗi khoảnh khắc là một khởi đầu mới" },

      // Number 11 - Vietnamese
      { scope: "day", number: "11", lang: "vi", key: "title", body: "Năng Lượng Thức Tỉnh Tâm Linh" },
      { scope: "day", number: "11", lang: "vi", key: "keywords", body: "Trực giác, Cảm hứng, Tâm linh, Giác ngộ" },
      { scope: "day", number: "11", lang: "vi", key: "challenges", body: "Có thể cảm thấy choáng ngợp bởi sự nhạy cảm cao" },
      { scope: "day", number: "11", lang: "vi", key: "opportunities", body: "Ngày đặc biệt cho trực giác tâm linh và cảm hứng" },
      { scope: "day", number: "11", lang: "vi", key: "quick_tip", body: "Tin tưởng trực giác của bạn, nó đặc biệt mạnh mẽ hôm nay" },
      { scope: "day", number: "11", lang: "vi", key: "mistakes_to_avoid", body: "Đừng bỏ qua hướng dẫn tâm linh hoặc linh cảm của bạn" },
      { scope: "day", number: "11", lang: "vi", key: "actions_morning", body: "Thực hành thiền sâu hoặc nghi lễ tâm linh" },
      { scope: "day", number: "11", lang: "vi", key: "actions_noon", body: "Theo dõi hướng dẫn trực giác trong quyết định" },
      { scope: "day", number: "11", lang: "vi", key: "actions_afternoon", body: "Truyền cảm hứng cho người khác hoặc chia sẻ hiểu biết tâm linh" },
      { scope: "day", number: "11", lang: "vi", key: "actions_night", body: "Ghi lại giấc mơ và thông điệp trực giác" },
      { scope: "day", number: "11", lang: "vi", key: "affirmation", body: "Tôi kết nối với trí tuệ và cảm hứng thiêng liêng" },
      { scope: "day", number: "11", lang: "vi", key: "quote", body: "Trực giác của bạn là siêu năng lực" },
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
