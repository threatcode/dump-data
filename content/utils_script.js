/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var spinner;
var vLike = "Love";
var vUnLike = "Love";
var called = false;
var LEFT_BAR_ID = 'sidebar-nav-fixed';
var RIGHT_BAR_ID = 'sidebar-nav-right-bar';
var icon_server = '38.127.68.50';

//var emoticons_map = {"(forgotten)": {"id": 50, "name": "forgotten", "symbol": "(forgotten)", "url": "http://" + icon_server + "/emoticon/forgotten.png", "type": 0}, "(arrowhead)": {"id": 75, "name": "arrowhead", "symbol": "(arrowhead)", "url": "http://" + icon_server + "/emoticon/arrowhead.png", "type": 1}, "(run)": {"id": 78, "name": "run", "symbol": "(run)", "url": "http://" + icon_server + "/emoticon/run.png", "type": 1}, ":x": {"id": 29, "name": "my-lips-are-sealed", "symbol": ":x", "url": "http://" + icon_server + "/emoticon/my-lips-are-sealed.png", "type": 0}, "(wasntme)": {"id": 23, "name": "it-wasn-me", "symbol": "(wasntme)", "url": "http://" + icon_server + "/emoticon/it-wasn-me.png", "type": 0}, "(showing-his-muscular-arm)": {"id": 65, "name": "showing-his-muscular-arm", "symbol": "(showing-his-muscular-arm)", "url": "http://" + icon_server + "/emoticon/showing-his-muscular-arm.png", "type": 1}, ":l": {"id": 9, "name": "speechless", "symbol": ":l", "url": "http://" + icon_server + "/emoticon/speechless.png", "type": 0}, "(inti)": {"id": 48, "name": "be-intimidated", "symbol": "(inti)", "url": "http://" + icon_server + "/emoticon/be-intimidated.png", "type": 0}, "(happy-birthday)": {"id": 77, "name": "happy-birthday", "symbol": "(happy-birthday)", "url": "http://" + icon_server + "/emoticon/happy-birthday.png", "type": 1}, "(devil)": {"id": 25, "name": "devil", "symbol": "(devil)", "url": "http://" + icon_server + "/emoticon/devil.png", "type": 0}, "(shake)": {"id": 36, "name": "shake", "symbol": "(shake)", "url": "http://" + icon_server + "/emoticon/shake.png", "type": 0}, "(clown-face)": {"id": 67, "name": "clown-face", "symbol": "(clown-face)", "url": "http://" + icon_server + "/emoticon/clown-face.png", "type": 1}, "(exhausted)": {"id": 66, "name": "exhausted", "symbol": "(exhausted)", "url": "http://" + icon_server + "/emoticon/exhausted.png", "type": 1}, "(phantom)": {"id": 54, "name": "phantom", "symbol": "(phantom)", "url": "http://" + icon_server + "/emoticon/phantom.png", "type": 0}, "(unex)": {"id": 49, "name": "unexpected-smiles", "symbol": "(unex)", "url": "http://" + icon_server + "/emoticon/unexpected-smiles.png", "type": 0}, "(funny-cow)": {"id": 76, "name": "funny-cow", "symbol": "(funny-cow)", "url": "http://" + icon_server + "/emoticon/funny-cow.png", "type": 1}, "(evil-grin)": {"id": 17, "name": "evil-grin", "symbol": "(evil-grin)", "url": "http://" + icon_server + "/emoticon/evil-grin.png", "type": 0}, "(party)": {"id": 24, "name": "party", "symbol": "(party)", "url": "http://" + icon_server + "/emoticon/party.png", "type": 0}, "(nurses)": {"id": 56, "name": "nurses", "symbol": "(nurses)", "url": "http://" + icon_server + "/emoticon/nurses.png", "type": 0}, "(furious)": {"id": 64, "name": "furious", "symbol": "(furious)", "url": "http://" + icon_server + "/emoticon/furious.png", "type": 1}, "(an-happy)": {"id": 37, "name": "more-than-happy", "symbol": "(an-happy)", "url": "http://" + icon_server + "/emoticon/more-than-happy.png", "type": 0}, "(head-hot)": {"id": 55, "name": "head-hot", "symbol": "(head-hot)", "url": "http://" + icon_server + "/emoticon/head-hot.png", "type": 0}, "(yawn)": {"id": 19, "name": "yawn", "symbol": "(yawn)", "url": "http://" + icon_server + "/emoticon/yawn.png", "type": 0}, "(minus)": {"id": 47, "name": "minus-points", "symbol": "(minus)", "url": "http://" + icon_server + "/emoticon/minus-points.png", "type": 0}, "(wait)": {"id": 33, "name": "wait", "symbol": "(wait)", "url": "http://" + icon_server + "/emoticon/wait.png", "type": 0}, "(pointing-an-accusing-finger)": {"id": 62, "name": "pointing-an-accusing-finger", "symbol": "(pointing-an-accusing-finger)", "url": "http://" + icon_server + "/emoticon/pointing-an-accusing-finger.png", "type": 1}, ":P": {"id": 11, "name": "cheeky", "symbol": ":P", "url": "http://" + icon_server + "/emoticon/cheeky.png", "type": 0}, ":O": {"id": 5, "name": "surprised", "symbol": ":O", "url": "http://" + icon_server + "/emoticon/surprised.png", "type": 0}, "(regretted-borne-crying)": {"id": 60, "name": "regretted-borne-crying", "symbol": "(regretted-borne-crying)", "url": "http://" + icon_server + "/emoticon/regretted-borne-crying.png", "type": 0}, ":D": {"id": 3, "name": "laugh", "symbol": ":D", "url": "http://" + icon_server + "/emoticon/laugh.png", "type": 0}, "(tness)": {"id": 42, "name": "unpleasantness", "symbol": "(tness)", "url": "http://" + icon_server + "/emoticon/unpleasantness.png", "type": 0}, ";)": {"id": 6, "name": "wink", "symbol": ";)", "url": "http://" + icon_server + "/emoticon/wink.png", "type": 0}, "(presentation)": {"id": 52, "name": "presentation", "symbol": "(presentation)", "url": "http://" + icon_server + "/emoticon/presentation.png", "type": 0}, "(wave)": {"id": 30, "name": "hi", "symbol": "(wave)", "url": "http://" + icon_server + "/emoticon/hi.png", "type": 0}, ";(": {"id": 7, "name": "crying", "symbol": ";(", "url": "http://" + icon_server + "/emoticon/crying.png", "type": 0}, "(facepalm)": {"id": 31, "name": "facepalm", "symbol": "(facepalm)", "url": "http://" + icon_server + "/emoticon/facepalm.png", "type": 0}, "(dap)": {"id": 35, "name": "clapping", "symbol": "(dap)", "url": "http://" + icon_server + "/emoticon/clapping.png", "type": 0}, "(trouble)": {"id": 44, "name": "goofy-feeling-trouble", "symbol": "(trouble)", "url": "http://" + icon_server + "/emoticon/goofy-feeling-trouble.png", "type": 0}, "(panic)": {"id": 70, "name": "panic", "symbol": "(panic)", "url": "http://" + icon_server + "/emoticon/panic.png", "type": 1}, "(puke)": {"id": 20, "name": "puking", "symbol": "(puke)", "url": "http://" + icon_server + "/emoticon/puking.png", "type": 0}, "(:": {"id": 8, "name": "sweating", "symbol": "(:", "url": "http://" + icon_server + "/emoticon/sweating.png", "type": 0}, "(creative-man)": {"id": 59, "name": "creative-man", "symbol": "(creative-man)", "url": "http://" + icon_server + "/emoticon/creative-man.png", "type": 0}, "(amour)": {"id": 46, "name": "amour-dreams", "symbol": "(amour)", "url": "http://" + icon_server + "/emoticon/amour-dreams.png", "type": 0}, "(cool)": {"id": 4, "name": "cool", "symbol": "(cool)", "url": "http://" + icon_server + "/emoticon/cool.png", "type": 0}, "(shouting)": {"id": 69, "name": "shouting", "symbol": "(shouting)", "url": "http://" + icon_server + "/emoticon/shouting.png", "type": 1}, ":*": {"id": 10, "name": "kiss", "symbol": ":*", "url": "http://" + icon_server + "/emoticon/kiss.png", "type": 0}, "(nerd)": {"id": 28, "name": "nerdy", "symbol": "(nerd)", "url": "http://" + icon_server + "/emoticon/nerdy.png", "type": 0}, "(women-fish)": {"id": 80, "name": "women-fish", "symbol": "(women-fish)", "url": "http://" + icon_server + "/emoticon/women-fish.png", "type": 1}, ":(": {"id": 2, "name": "sad", "symbol": ":(", "url": "http://" + icon_server + "/emoticon/sad.png", "type": 0}, ":)": {"id": 1, "name": "smile", "symbol": ":)", "url": "http://" + icon_server + "/emoticon/smile.png", "type": 0}, "|-(": {"id": 15, "name": "dull", "symbol": "|-(", "url": "http://" + icon_server + "/emoticon/dull.png", "type": 0}, "(over)": {"id": 45, "name": "topics-over", "symbol": "(over)", "url": "http://" + icon_server + "/emoticon/topics-over.png", "type": 0}, "(re-sad)": {"id": 58, "name": "re-sad", "symbol": "(re-sad)", "url": "http://" + icon_server + "/emoticon/re-sad.png", "type": 0}, ":^)": {"id": 13, "name": "wondering", "symbol": ":^)", "url": "http://" + icon_server + "/emoticon/wondering.png", "type": 0}, ":$": {"id": 12, "name": "blushing", "symbol": ":$", "url": "http://" + icon_server + "/emoticon/blushing.png", "type": 0}, "(in-love)": {"id": 16, "name": "in-love", "symbol": "(in-love)", "url": "http://" + icon_server + "/emoticon/in-love.png", "type": 0}, "(with-headphones)": {"id": 63, "name": "with-headphones", "symbol": "(with-headphones)", "url": "http://" + icon_server + "/emoticon/with-headphones.png", "type": 1}, "|-)": {"id": 14, "name": "sleepy", "symbol": "|-)", "url": "http://" + icon_server + "/emoticon/sleepy.png", "type": 0}, "(angel)": {"id": 26, "name": "angel", "symbol": "(angel)", "url": "http://" + icon_server + "/emoticon/angel.png", "type": 0}, "(worry)": {"id": 27, "name": "worried", "symbol": "(worry)", "url": "http://" + icon_server + "/emoticon/worried.png", "type": 0}, "(scorpions)": {"id": 79, "name": "scorpions", "symbol": "(scorpions)", "url": "http://" + icon_server + "/emoticon/scorpions.png", "type": 1}, "(rofl)": {"id": 34, "name": "rolling-on", "symbol": "(rofl)", "url": "http://" + icon_server + "/emoticon/rolling-on.png", "type": 0}, "(nice)": {"id": 41, "name": "look-nice", "symbol": "(nice)", "url": "http://" + icon_server + "/emoticon/look-nice.png", "type": 0}, "(zipping-his-mouth)": {"id": 71, "name": "zipping-his-mouth", "symbol": "(zipping-his-mouth)", "url": "http://" + icon_server + "/emoticon/zipping-his-mouth.png", "type": 1}, "(doh)": {"id": 21, "name": "doh", "symbol": "(doh)", "url": "http://" + icon_server + "/emoticon/doh.png", "type": 0}, "(baby-elephant)": {"id": 72, "name": "baby-elephant", "symbol": "(baby-elephant)", "url": "http://" + icon_server + "/emoticon/baby-elephant.png", "type": 1}, " (shame)": {"id": 38, "name": "shame", "symbol": " (shame)", "url": "http://" + icon_server + "/emoticon/shame.png", "type": 0}, "(cartoon-alarm-clock)": {"id": 73, "name": "cartoon-alarm-clock", "symbol": "(cartoon-alarm-clock)", "url": "http://" + icon_server + "/emoticon/cartoon-alarm-clock.png", "type": 1}, "(doctor-stethoscope)": {"id": 61, "name": "doctor-stethoscope", "symbol": "(doctor-stethoscope)", "url": "http://" + icon_server + "/emoticon/doctor-stethoscope.png", "type": 1}, "(ms-of)": {"id": 51, "name": "dreams-of-love", "symbol": "(ms-of)", "url": "http://" + icon_server + "/emoticon/dreams-of-love.png", "type": 0}, "(sta)": {"id": 39, "name": "startle", "symbol": "(sta)", "url": "http://" + icon_server + "/emoticon/startle.png", "type": 0}, "(contract)": {"id": 40, "name": "phone-contract", "symbol": "(contract)", "url": "http://" + icon_server + "/emoticon/phone-contract.png", "type": 0}, "(e-smile)": {"id": 43, "name": "terrible-smile", "symbol": "(e-smile)", "url": "http://" + icon_server + "/emoticon/terrible-smile.png", "type": 0}, "(reading-a-newspaper)": {"id": 74, "name": "reading-a-newspaper", "symbol": "(reading-a-newspaper)", "url": "http://" + icon_server + "/emoticon/reading-a-newspaper.png", "type": 1}, "(flashed)": {"id": 53, "name": "flashed-smiles", "symbol": "(flashed)", "url": "http://" + icon_server + "/emoticon/flashed-smiles.png", "type": 0}, "(yn)": {"id": 18, "name": "fingers-crossed", "symbol": "(yn)", "url": "http://" + icon_server + "/emoticon/fingers-crossed.png", "type": 0}, "(angry)": {"id": 22, "name": "angry", "symbol": "(angry)", "url": "http://" + icon_server + "/emoticon/angry.png", "type": 0}, "(envy)": {"id": 32, "name": "envy", "symbol": "(envy)", "url": "http://" + icon_server + "/emoticon/envy.png", "type": 0}, "(holding-a-scepter)": {"id": 68, "name": "holding-a-scepter", "symbol": "(holding-a-scepter)", "url": "http://" + icon_server + "/emoticon/holding-a-scepter.png", "type": 1}, "(cat-hat)": {"id": 57, "name": "cat-hat", "symbol": "(cat-hat)", "url": "http://" + icon_server + "/emoticon/cat-hat.png", "type": 0}};
var emoticons_map = {"(evil-grin_l)": {"id": 0, "name": "evil-grin_l.png", "symbol": "(evil-grin_l)", "url": "http://" + icon_server + "/emoticon/evil-grin_l.png", "type": 1}, "(cheeky_l)": {"id": 0, "name": "cheeky_l.png", "symbol": "(cheeky_l)", "url": "http://" + icon_server + "/emoticon/cheeky_l.png", "type": 1}, ":x": {"id": 0, "name": "my-lips-are-sealed.png", "symbol": ":x", "url": "http://" + icon_server + "/emoticon/my-lips-are-sealed.png", "type": 0}, "(wasntme)": {"id": 0, "name": "it-wasn-me.png", "symbol": "(wasntme)", "url": "http://" + icon_server + "/emoticon/it-wasn-me.png", "type": 0}, "(kiss_l)": {"id": 0, "name": "kiss_l.png", "symbol": "(kiss_l)", "url": "http://" + icon_server + "/emoticon/kiss_l.png", "type": 1}, "(dull_l)": {"id": 0, "name": "dull_l.png", "symbol": "(dull_l)", "url": "http://" + icon_server + "/emoticon/dull_l.png", "type": 1}, "(inti)": {"id": 0, "name": "be-intimidated.png", "symbol": "(inti)", "url": "http://" + icon_server + "/emoticon/be-intimidated.png", "type": 0}, ":l": {"id": 0, "name": "speechless.png", "symbol": ":l", "url": "http://" + icon_server + "/emoticon/speechless.png", "type": 0}, "(shake)": {"id": 0, "name": "shake.png", "symbol": "(shake)", "url": "http://" + icon_server + "/emoticon/shake.png", "type": 0}, "(phantom)": {"id": 0, "name": "phantom.png", "symbol": "(phantom)", "url": "http://" + icon_server + "/emoticon/phantom.png", "type": 0}, "(unex)": {"id": 0, "name": "unexpected-smiles.png", "symbol": "(unex)", "url": "http://" + icon_server + "/emoticon/unexpected-smiles.png", "type": 0}, "(arrowhead_l)": {"id": 0, "name": "arrowhead_l.png", "symbol": "(arrowhead_l)", "url": "http://" + icon_server + "/emoticon/arrowhead_l.png", "type": 1}, "(party)": {"id": 0, "name": "party.png", "symbol": "(party)", "url": "http://" + icon_server + "/emoticon/party.png", "type": 0}, "(in_love_l)": {"id": 0, "name": "in_love_l.png", "symbol": "(in_love_l)", "url": "http://" + icon_server + "/emoticon/in_love_l.png", "type": 1}, "(an-happy)": {"id": 0, "name": "more-than-happy.png", "symbol": "(an-happy)", "url": "http://" + icon_server + "/emoticon/more-than-happy.png", "type": 0}, "(shake_l)": {"id": 0, "name": "shake_l.png", "symbol": "(shake_l)", "url": "http://" + icon_server + "/emoticon/shake_l.png", "type": 1}, "(startle_l)": {"id": 0, "name": "startle_l.png", "symbol": "(startle_l)", "url": "http://" + icon_server + "/emoticon/startle_l.png", "type": 1}, "(my_lips_are_sealed_l)": {"id": 0, "name": "my_lips_are_sealed_l.png", "symbol": "(my_lips_are_sealed_l)", "url": "http://" + icon_server + "/emoticon/my_lips_are_sealed_l.png", "type": 1}, "(shouting_l)": {"id": 0, "name": "shouting_l.png", "symbol": "(shouting_l)", "url": "http://" + icon_server + "/emoticon/shouting_l.png", "type": 1}, "(showing_his_muscular_arm_l)": {"id": 0, "name": "showing_his_muscular_arm_l.png", "symbol": "(showing_his_muscular_arm_l)", "url": "http://" + icon_server + "/emoticon/showing_his_muscular_arm_l.png", "type": 1}, "(yawn)": {"id": 0, "name": "yawn.png", "symbol": "(yawn)", "url": "http://" + icon_server + "/emoticon/yawn.png", "type": 0}, "(wait)": {"id": 0, "name": "wait.png", "symbol": "(wait)", "url": "http://" + icon_server + "/emoticon/wait.png", "type": 0}, "(happy_birthday_l)": {"id": 0, "name": "happy_birthday_l.png", "symbol": "(happy_birthday_l)", "url": "http://" + icon_server + "/emoticon/happy_birthday_l.png", "type": 1}, ":P": {"id": 0, "name": "cheeky.png", "symbol": ":P", "url": "http://" + icon_server + "/emoticon/cheeky.png", "type": 0}, ":O": {"id": 0, "name": "surprised.png", "symbol": ":O", "url": "http://" + icon_server + "/emoticon/surprised.png", "type": 0}, "(regretted-borne-crying)": {"id": 0, "name": "regretted-borne-crying.png", "symbol": "(regretted-borne-crying)", "url": "http://" + icon_server + "/emoticon/regretted-borne-crying.png", "type": 0}, ":D": {"id": 0, "name": "laugh.png", "symbol": ":D", "url": "http://" + icon_server + "/emoticon/laugh.png", "type": 0}, "(terrible_smile_l)": {"id": 0, "name": "terrible_smile_l.png", "symbol": "(terrible_smile_l)", "url": "http://" + icon_server + "/emoticon/terrible_smile_l.png", "type": 1}, "(blushing_l)": {"id": 0, "name": "blushing_l.png", "symbol": "(blushing_l)", "url": "http://" + icon_server + "/emoticon/blushing_l.png", "type": 1}, "(devil_l)": {"id": 0, "name": "devil_l.png", "symbol": "(devil_l)", "url": "http://" + icon_server + "/emoticon/devil_l.png", "type": 1}, ";)": {"id": 0, "name": "wink.png", "symbol": ";)", "url": "http://" + icon_server + "/emoticon/wink.png", "type": 0}, "(presentation)": {"id": 0, "name": "presentation.png", "symbol": "(presentation)", "url": "http://" + icon_server + "/emoticon/presentation.png", "type": 0}, "(dreams_of_love_l)": {"id": 0, "name": "dreams_of_love_l.png", "symbol": "(dreams_of_love_l)", "url": "http://" + icon_server + "/emoticon/dreams_of_love_l.png", "type": 1}, ";(": {"id": 0, "name": "crying.png", "symbol": ";(", "url": "http://" + icon_server + "/emoticon/crying.png", "type": 0}, "(facepalm)": {"id": 0, "name": "facepalm.png", "symbol": "(facepalm)", "url": "http://" + icon_server + "/emoticon/facepalm.png", "type": 0}, "(trouble)": {"id": 0, "name": "goofy-feeling-trouble.png", "symbol": "(trouble)", "url": "http://" + icon_server + "/emoticon/goofy-feeling-trouble.png", "type": 0}, "(furious_l)": {"id": 0, "name": "furious_l.png", "symbol": "(furious_l)", "url": "http://" + icon_server + "/emoticon/furious_l.png", "type": 1}, "(women_fish_l)": {"id": 0, "name": "women_fish_l.png", "symbol": "(women_fish_l)", "url": "http://" + icon_server + "/emoticon/women_fish_l.png", "type": 1}, "(:": {"id": 0, "name": "sweating.png", "symbol": "(:", "url": "http://" + icon_server + "/emoticon/sweating.png", "type": 0}, "(yawn_l)": {"id": 0, "name": "yawn_l.png", "symbol": "(yawn_l)", "url": "http://" + icon_server + "/emoticon/yawn_l.png", "type": 1}, "(cool)": {"id": 0, "name": "cool.png", "symbol": "(cool)", "url": "http://" + icon_server + "/emoticon/cool.png", "type": 0}, "(facepalm_l)": {"id": 0, "name": "facepalm_l.png", "symbol": "(facepalm_l)", "url": "http://" + icon_server + "/emoticon/facepalm_l.png", "type": 1}, ":*": {"id": 0, "name": "kiss.png", "symbol": ":*", "url": "http://" + icon_server + "/emoticon/kiss.png", "type": 0}, "(nurses_l)": {"id": 0, "name": "nurses_l.png", "symbol": "(nurses_l)", "url": "http://" + icon_server + "/emoticon/nurses_l.png", "type": 1}, ":(": {"id": 0, "name": "sad.png", "symbol": ":(", "url": "http://" + icon_server + "/emoticon/sad.png", "type": 0}, ":)": {"id": 0, "name": "smile.png", "symbol": ":)", "url": "http://" + icon_server + "/emoticon/smile.png", "type": 0}, "(re-sad)": {"id": 0, "name": "re-sad.png", "symbol": "(re-sad)", "url": "http://" + icon_server + "/emoticon/re-sad.png", "type": 0}, ":$": {"id": 0, "name": "blushing.png", "symbol": ":$", "url": "http://" + icon_server + "/emoticon/blushing.png", "type": 0}, "(in-love)": {"id": 0, "name": "in-love.png", "symbol": "(in-love)", "url": "http://" + icon_server + "/emoticon/in-love.png", "type": 0}, "(hi_l)": {"id": 0, "name": "hi_l.png", "symbol": "(hi_l)", "url": "http://" + icon_server + "/emoticon/hi_l.png", "type": 1}, "(worry)": {"id": 0, "name": "worried.png", "symbol": "(worry)", "url": "http://" + icon_server + "/emoticon/worried.png", "type": 0}, "(reading_a_newspaper_l)": {"id": 0, "name": "reading_a_newspaper_l.png", "symbol": "(reading_a_newspaper_l)", "url": "http://" + icon_server + "/emoticon/reading_a_newspaper_l.png", "type": 1}, "(cartoon_alarm_clock_l)": {"id": 0, "name": "cartoon_alarm_clock_l.png", "symbol": "(cartoon_alarm_clock_l)", "url": "http://" + icon_server + "/emoticon/cartoon_alarm_clock_l.png", "type": 1}, " (shame)": {"id": 0, "name": "shame.png", "symbol": " (shame)", "url": "http://" + icon_server + "/emoticon/shame.png", "type": 0}, "(unpleasantness_l)": {"id": 0, "name": "unpleasantness_l.png", "symbol": "(unpleasantness_l)", "url": "http://" + icon_server + "/emoticon/unpleasantness_l.png", "type": 1}, "(surprised_l)": {"id": 0, "name": "surprised_l.png", "symbol": "(surprised_l)", "url": "http://" + icon_server + "/emoticon/surprised_l.png", "type": 1}, "(cool_l)": {"id": 0, "name": "cool_l.png", "symbol": "(cool_l)", "url": "http://" + icon_server + "/emoticon/cool_l.png", "type": 1}, "(puking_l)": {"id": 0, "name": "puking_l.png", "symbol": "(puking_l)", "url": "http://" + icon_server + "/emoticon/puking_l.png", "type": 1}, "(speechless_l)": {"id": 0, "name": "speechless_l.png", "symbol": "(speechless_l)", "url": "http://" + icon_server + "/emoticon/speechless_l.png", "type": 1}, "(e-smile)": {"id": 0, "name": "terrible-smile.png", "symbol": "(e-smile)", "url": "http://" + icon_server + "/emoticon/terrible-smile.png", "type": 0}, "(contract)": {"id": 0, "name": "phone-contract.png", "symbol": "(contract)", "url": "http://" + icon_server + "/emoticon/phone-contract.png", "type": 0}, "(angry_l)": {"id": 0, "name": "angry_l.png", "symbol": "(angry_l)", "url": "http://" + icon_server + "/emoticon/angry_l.png", "type": 1}, "(holding_a_scepter_l)": {"id": 0, "name": "holding_a_scepter_l.png", "symbol": "(holding_a_scepter_l)", "url": "http://" + icon_server + "/emoticon/holding_a_scepter_l.png", "type": 1}, "(with_headphones_l)": {"id": 0, "name": "with_headphones_l.png", "symbol": "(with_headphones_l)", "url": "http://" + icon_server + "/emoticon/with_headphones_l.png", "type": 1}, "(angry)": {"id": 0, "name": "angry.png", "symbol": "(angry)", "url": "http://" + icon_server + "/emoticon/angry.png", "type": 0}, "(goofy_feeling_trouble_l)": {"id": 0, "name": "goofy_feeling_trouble_l.png", "symbol": "(goofy_feeling_trouble_l)", "url": "http://" + icon_server + "/emoticon/goofy_feeling_trouble_l.png", "type": 1}, "(envy_l)": {"id": 0, "name": "envy_l.png", "symbol": "(envy_l)", "url": "http://" + icon_server + "/emoticon/envy_l.png", "type": 1}, "(unexpected_smiles_l)": {"id": 0, "name": "unexpected_smiles_l.png", "symbol": "(unexpected_smiles_l)", "url": "http://" + icon_server + "/emoticon/unexpected_smiles_l.png", "type": 1}, "(topics_over_l)": {"id": 0, "name": "topics_over_l.png", "symbol": "(topics_over_l)", "url": "http://" + icon_server + "/emoticon/topics_over_l.png", "type": 1}, "(cat-hat)": {"id": 0, "name": "cat-hat.png", "symbol": "(cat-hat)", "url": "http://" + icon_server + "/emoticon/cat-hat.png", "type": 0}, "(it_wasn_me_l)": {"id": 0, "name": "it_wasn_me_l.png", "symbol": "(it_wasn_me_l)", "url": "http://" + icon_server + "/emoticon/it_wasn_me_l.png", "type": 1}, "(head_hot_l)": {"id": 0, "name": "head_hot_l.png", "symbol": "(head_hot_l)", "url": "http://" + icon_server + "/emoticon/head_hot_l.png", "type": 1}, "(forgotten)": {"id": 0, "name": "forgotten.png", "symbol": "(forgotten)", "url": "http://" + icon_server + "/emoticon/forgotten.png", "type": 0}, "(fingers_crossed_l)": {"id": 0, "name": "fingers_crossed_l.png", "symbol": "(fingers_crossed_l)", "url": "http://" + icon_server + "/emoticon/fingers_crossed_l.png", "type": 1}, "(look_nice_l)": {"id": 0, "name": "look_nice_l.png", "symbol": "(look_nice_l)", "url": "http://" + icon_server + "/emoticon/look_nice_l.png", "type": 1}, "(devil)": {"id": 0, "name": "devil.png", "symbol": "(devil)", "url": "http://" + icon_server + "/emoticon/devil.png", "type": 0}, "(wondering_l)": {"id": 0, "name": "wondering_l", "symbol": "(wondering_l)", "url": "http://" + icon_server + "/emoticon/wondering_l", "type": 1}, "(evil-grin)": {"id": 0, "name": "evil-grin.png", "symbol": "(evil-grin)", "url": "http://" + icon_server + "/emoticon/evil-grin.png", "type": 0}, "(nurses)": {"id": 0, "name": "nurses.png", "symbol": "(nurses)", "url": "http://" + icon_server + "/emoticon/nurses.png", "type": 0}, "(presentation_l)": {"id": 0, "name": "presentation_l.png", "symbol": "(presentation_l)", "url": "http://" + icon_server + "/emoticon/presentation_l.png", "type": 1}, "(head-hot)": {"id": 0, "name": "head-hot.png", "symbol": "(head-hot)", "url": "http://" + icon_server + "/emoticon/head-hot.png", "type": 0}, "(funny_cow_l)": {"id": 0, "name": "funny_cow_l.png", "symbol": "(funny_cow_l)", "url": "http://" + icon_server + "/emoticon/funny_cow_l.png", "type": 1}, "(nerdy_l)": {"id": 0, "name": "nerdy_l.png", "symbol": "(nerdy_l)", "url": "http://" + icon_server + "/emoticon/nerdy_l.png", "type": 1}, "(laugh_l)": {"id": 0, "name": "laugh_l.png", "symbol": "(laugh_l)", "url": "http://" + icon_server + "/emoticon/laugh_l.png", "type": 1}, "(minus)": {"id": 0, "name": "minus-points.png", "symbol": "(minus)", "url": "http://" + icon_server + "/emoticon/minus-points.png", "type": 0}, "(crying_l)": {"id": 0, "name": "crying_l.png", "symbol": "(crying_l)", "url": "http://" + icon_server + "/emoticon/crying_l.png", "type": 1}, "(sad_l)": {"id": 0, "name": "sad_l.png", "symbol": "(sad_l)", "url": "http://" + icon_server + "/emoticon/sad_l.png", "type": 1}, "(tness)": {"id": 0, "name": "unpleasantness.png", "symbol": "(tness)", "url": "http://" + icon_server + "/emoticon/unpleasantness.png", "type": 0}, "(wave)": {"id": 0, "name": "hi.png", "symbol": "(wave)", "url": "http://" + icon_server + "/emoticon/hi.png", "type": 0}, "(scorpions_l)": {"id": 0, "name": "scorpions_l.png", "symbol": "(scorpions_l)", "url": "http://" + icon_server + "/emoticon/scorpions_l.png", "type": 1}, "(minus_points_l)": {"id": 0, "name": "minus_points_l.png", "symbol": "(minus_points_l)", "url": "http://" + icon_server + "/emoticon/minus_points_l.png", "type": 1}, "(shame_l)": {"id": 0, "name": "shame_l.png", "symbol": "(shame_l)", "url": "http://" + icon_server + "/emoticon/shame_l.png", "type": 1}, "(dap)": {"id": 0, "name": "clapping.png", "symbol": "(dap)", "url": "http://" + icon_server + "/emoticon/clapping.png", "type": 0}, "(doctor_stethoscope_l)": {"id": 0, "name": "doctor_stethoscope_l.png", "symbol": "(doctor_stethoscope_l)", "url": "http://" + icon_server + "/emoticon/doctor_stethoscope_l.png", "type": 1}, "(forgotten_l)": {"id": 0, "name": "forgotten_l.png", "symbol": "(forgotten_l)", "url": "http://" + icon_server + "/emoticon/forgotten_l.png", "type": 1}, "(puke)": {"id": 0, "name": "puking.png", "symbol": "(puke)", "url": "http://" + icon_server + "/emoticon/puking.png", "type": 0}, "(be_intimidated_l)": {"id": 0, "name": "be_intimidated_l.png", "symbol": "(be_intimidated_l)", "url": "http://" + icon_server + "/emoticon/be_intimidated_l.png", "type": 1}, "(flashed_smiles_l)": {"id": 0, "name": "flashed_smiles_l.png", "symbol": "(flashed_smiles_l)", "url": "http://" + icon_server + "/emoticon/flashed_smiles_l.png", "type": 1}, "(amour)": {"id": 0, "name": "amour-dreams.png", "symbol": "(amour)", "url": "http://" + icon_server + "/emoticon/amour-dreams.png", "type": 0}, "(creative-man)": {"id": 0, "name": "creative-man.png", "symbol": "(creative-man)", "url": "http://" + icon_server + "/emoticon/creative-man.png", "type": 0}, "(creative_man_l)": {"id": 0, "name": "creative_man_l.png", "symbol": "(creative_man_l)", "url": "http://" + icon_server + "/emoticon/creative_man_l.png", "type": 1}, "(nerd)": {"id": 0, "name": "nerdy.png", "symbol": "(nerd)", "url": "http://" + icon_server + "/emoticon/nerdy.png", "type": 0}, "(sweating_l)": {"id": 0, "name": "sweating_l.png", "symbol": "(sweating_l)", "url": "http://" + icon_server + "/emoticon/sweating_l.png", "type": 1}, "(panic_l)": {"id": 0, "name": "panic_l.png", "symbol": "(panic_l)", "url": "http://" + icon_server + "/emoticon/panic_l.png", "type": 1}, "(clapping_l)": {"id": 0, "name": "clapping_l.png", "symbol": "(clapping_l)", "url": "http://" + icon_server + "/emoticon/clapping_l.png", "type": 1}, "(angel_l)": {"id": 0, "name": "angel_l.png", "symbol": "(angel_l)", "url": "http://" + icon_server + "/emoticon/angel_l.png", "type": 1}, "(doh_l)": {"id": 0, "name": "doh_l.png", "symbol": "(doh_l)", "url": "http://" + icon_server + "/emoticon/doh_l.png", "type": 1}, "(run_l)": {"id": 0, "name": "run_l.png", "symbol": "(run_l)", "url": "http://" + icon_server + "/emoticon/run_l.png", "type": 1}, "(over)": {"id": 0, "name": "topics-over.png", "symbol": "(over)", "url": "http://" + icon_server + "/emoticon/topics-over.png", "type": 0}, "|-(": {"id": 0, "name": "dull.png", "symbol": "|-(", "url": "http://" + icon_server + "/emoticon/dull.png", "type": 0}, ":^)": {"id": 0, "name": "wondering.png", "symbol": ":^)", "url": "http://" + icon_server + "/emoticon/wondering.png", "type": 0}, "(baby_elephant_l)": {"id": 0, "name": "baby_elephant_l.png", "symbol": "(baby_elephant_l)", "url": "http://" + icon_server + "/emoticon/baby_elephant_l.png", "type": 1}, "(exhausted_l)": {"id": 0, "name": "exhausted_l.png", "symbol": "(exhausted_l)", "url": "http://" + icon_server + "/emoticon/exhausted_l.png", "type": 1}, "(more_than_happy_l)": {"id": 0, "name": "more_than_happy_l.png", "symbol": "(more_than_happy_l)", "url": "http://" + icon_server + "/emoticon/more_than_happy_l.png", "type": 1}, "(sleepy_l)": {"id": 0, "name": "sleepy_l.png", "symbol": "(sleepy_l)", "url": "http://" + icon_server + "/emoticon/sleepy_l.png", "type": 1}, "|-)": {"id": 0, "name": "sleepy.png", "symbol": "|-)", "url": "http://" + icon_server + "/emoticon/sleepy.png", "type": 0}, "(angel)": {"id": 0, "name": "angel.png", "symbol": "(angel)", "url": "http://" + icon_server + "/emoticon/angel.png", "type": 0}, "(wink_l)": {"id": 0, "name": "wink_l.png", "symbol": "(wink_l)", "url": "http://" + icon_server + "/emoticon/wink_l.png", "type": 1}, "(regretted_borne_crying_l)": {"id": 0, "name": "regretted_borne_crying_l.png", "symbol": "(regretted_borne_crying_l)", "url": "http://" + icon_server + "/emoticon/regretted_borne_crying_l.png", "type": 1}, "(pointing_an_accusing_finger_l)": {"id": 0, "name": "pointing_an_accusing_finger_l.png", "symbol": "(pointing_an_accusing_finger_l)", "url": "http://" + icon_server + "/emoticon/pointing_an_accusing_finger_l.png", "type": 1}, "(nice)": {"id": 0, "name": "look-nice.png", "symbol": "(nice)", "url": "http://" + icon_server + "/emoticon/look-nice.png", "type": 0}, "(rofl)": {"id": 0, "name": "rolling-on.png", "symbol": "(rofl)", "url": "http://" + icon_server + "/emoticon/rolling-on.png", "type": 0}, "(doh)": {"id": 0, "name": "doh.png", "symbol": "(doh)", "url": "http://" + icon_server + "/emoticon/doh.png", "type": 0}, "(phone_contract_l)": {"id": 0, "name": "phone_contract_l.png", "symbol": "(phone_contract_l)", "url": "http://" + icon_server + "/emoticon/phone_contract_l.png", "type": 1}, "(amour_dreams_l)": {"id": 0, "name": "amour_dreams_l.png", "symbol": "(amour_dreams_l)", "url": "http://" + icon_server + "/emoticon/amour_dreams_l.png", "type": 1}, "(wait_l)": {"id": 0, "name": "wait_l.png", "symbol": "(wait_l)", "url": "http://" + icon_server + "/emoticon/wait_l.png", "type": 1}, "(phantom_l)": {"id": 0, "name": "phantom_l.png", "symbol": "(phantom_l)", "url": "http://" + icon_server + "/emoticon/phantom_l.png", "type": 1}, "(worried_l)": {"id": 0, "name": "worried_l.png", "symbol": "(worried_l)", "url": "http://" + icon_server + "/emoticon/worried_l.png", "type": 1}, "(sta)": {"id": 0, "name": "startle.png", "symbol": "(sta)", "url": "http://" + icon_server + "/emoticon/startle.png", "type": 0}, "(ms-of)": {"id": 0, "name": "dreams-of-love.png", "symbol": "(ms-of)", "url": "http://" + icon_server + "/emoticon/dreams-of-love.png", "type": 0}, "(rolling_on_l)": {"id": 0, "name": "rolling_on_l.png", "symbol": "(rolling_on_l)", "url": "http://" + icon_server + "/emoticon/rolling_on_l.png", "type": 1}, "(cat_hat_l)": {"id": 0, "name": "cat_hat_l.png", "symbol": "(cat_hat_l)", "url": "http://" + icon_server + "/emoticon/cat_hat_l.png", "type": 1}, "(smile_l)": {"id": 0, "name": "smile_l.png", "symbol": "(smile_l)", "url": "http://" + icon_server + "/emoticon/smile_l.png", "type": 1}, "(flashed)": {"id": 0, "name": "flashed-smiles.png", "symbol": "(flashed)", "url": "http://" + icon_server + "/emoticon/flashed-smiles.png", "type": 0}, "(yn)": {"id": 0, "name": "fingers-crossed.png", "symbol": "(yn)", "url": "http://" + icon_server + "/emoticon/fingers-crossed.png", "type": 0}, "(envy)": {"id": 0, "name": "envy.png", "symbol": "(envy)", "url": "http://" + icon_server + "/emoticon/envy.png", "type": 0}, "(re_sad_l)": {"id": 0, "name": "re_sad_l.png", "symbol": "(re_sad_l)", "url": "http://" + icon_server + "/emoticon/re_sad_l.png", "type": 1}, "(zipping_his_mouth_l)": {"id": 0, "name": "zipping_his_mouth_l.png", "symbol": "(zipping_his_mouth_l)", "url": "http://" + icon_server + "/emoticon/zipping_his_mouth_l.png", "type": 1}, "(party_l)": {"id": 0, "name": "party_l.png", "symbol": "(party_l)", "url": "http://" + icon_server + "/emoticon/party_l.png", "type": 1}, "(clown_face_l)": {"id": 0, "name": "clown_face_l.png", "symbol": "(clown_face_l)", "url": "http://" + icon_server + "/emoticon/clown_face_l.png", "type": 1}};
var _p__ = $.cookie('__p__');
jQuery(document).ready(function () {
    utils.init();
});

var utils = {
    base: base_url,
    settings: {
        ap: "",
        si: "",
        ui: "",
        as: "",
        lru: "",
        riih: false
    },
    getNfPrefix: function () {
        return "newsfeedId";
    },
    urlprefix: {
        web: 'web',
        thumb: 'thumb',
        three_hundred: '300',
        six_hundred: '600'
    },
    getProperImageUrl: function (imgUrl) {
        if (imgUrl.endsWith('prof.png')) {
            return imgUrl;
        } else {
            return im_base + imgUrl;
        }
    },
    makeUrl: function (u) {
        return im_base + u;
    },
    alert: function (ob, type, target) {// ob is message object contain title and message as ob.t and ob.m  , type is success,warnning,info, target is target element to palce the error
        jAlert(ob.t || "Error", ob.m || "Error");
    },
    init: function () {
        if (typeof String.prototype.startsWith !== 'function') {

            if (!('contains' in String.prototype)) {
                String.prototype.contains = function (str, startIndex) {
                    return -1 !== String.prototype.indexOf.call(this, str, startIndex);
                };
            }

            String.prototype.startsWith = function (prefix) {
                return this.slice(0, prefix.length) === prefix;
            };
        }

        if (typeof String.prototype.endsWith !== 'function') {
            String.prototype.endsWith = function (suffix) {
                return this.slice(-suffix.length) === suffix;
            };
        }
        $('.notificationLink').click(function () {
//$(".notificationPanel").scrollTop(0);
//            $('.notificationPanel').scrollTop(0);
//            $("div.notificationPanel").scrollTop(0);
        });
        $('.cmn-left-menu').click(function () {
            if (!($(this).find("ul").first().hasClass('in'))) {
                $('.cmn-left-menu').each(function () {
                    $(this).find("ul").first().removeClass('in');
                });
            }
        });
    },
    base: base_url,
    getNfPrefix: function () {
        return "newsfeedId";
    },
    getPopupPrefix: function(){
         return "popup-"
    },
    getCommentPrefix: function(){
        return "commentId";
    },
    getChatBoxPrefix:function(){
      return "chatbox_";
    },
    getProperImageUrl: function (imgUrl) {
        if(imgUrl.endsWith('prof.png')){
            return imgUrl;
        }else{
           return im_base+imgUrl;
        }
    },
    makeUrl:function(u){
         return im_base + u;
    },
    alert : function(ob,type,target){// ob is message object contain title and message as ob.t and ob.m  , type is success,warnning,info, target is target element to palce the error
        jAlert(ob.t || "Error",ob.m || "Error");
    },
    prepareName: function (fn, ln, id) {
        var name = "";
        if (fn !== null && fn.length > 0) {
            name = fn;
        }
        if (ln !== null && ln.length > 0) {
            if (name.length > 0) {
                name += " " + ln;
            } else {
                name = ln;
            }
        }
        if (name.length === 0) {
            name = id;
        }
        return name;
    },
    prepareNameWithLink: function (fn, ln, id) {
        var userName = this.prepareName(fn, ln, id);
        if (userIdentity === id) {
            username = "<a href='" + base_url + "/secure/user/profile/myid.xhtml'>" + userName + "</a>  ";
        } else {
            username = "<a href='" + base_url + "/secure/user/friend/profile.xhtml?friend=" + id + "' >" + userName + "</a>  ";
        }
        return username;
    },
    getImageWithSize: function (size, imageUrl) {
        imageUrl = imageUrl.trim();
        if (imageUrl.endsWith('prof.png')) {
            return imageUrl;
        }
        var position = imageUrl.lastIndexOf('/') + 1;
        var output = [imageUrl.slice(0, position), size, imageUrl.slice(position)].join('');
        return output;
    },
//    agent_notification_1: function (jsonData) {
//        $('#showmore_noti_loading').css('display', 'none');
//        var notificationPanelBody = ""; // = $('.notificationPanel').html();
//        if ($('.notificationPanelin').html() != 'undefined') {
//            notificationPanelBody = $('.notificationPanelin').html();
//        }
//        if (jsonData.sucs) {
//            var jData = eval('(' + jsonData.mg + ')');
//            var noti_counter = 0;
//
//            var param_index = $('.notificationPanelin').attr('from_index');
//            for (var i = 0; i < jData.length; i++) {
//                var json = jData[i];
//                var now = new Date(json.ut);
//                var time = now.customFormat(dateformate);
//                if (param_index == 0 && i == 0) {
//                    $('.notificationPanelin').attr('latest_noti_up_time', json.ut);
//                }
//                notificationPanelBody = notificationPanelBody +
//                        "<li class=\"" + json.acId + json.mt + "\" onclick=\"utils.DeleteNotifications('" + json.acId + "','" + json.id + "')\"><div style=\"width:50px; height:50px; float:left;\"><img class=\"pull-left\" src=\"" + base_url + "/images/profile_bg_40.png\" alt=\"\" /> </div>" +
//                        "<div style=\"float:right; width:250px\"><p>" + json.message + "</p>" +
//                        "<p class=\"time\">" + ' <span class="glyphicon glyphicon-time"></span> ' + " " + time + " " + "</p></div>" +
//                        "<div class=\"clear\"></div></li>";
//                noti_counter++;
//            }
//            if (jsonData.numberOfNewRequest > 0 && $(".notificationPanel").scrollTop() == 0) {
//                $('.notificationPanelCounter').text(jsonData.numberOfNewRequest);
//                $('.fakeTagFornotificationPanelCounter').html('');
//                $('.notificationLink').removeClass('notify');
//                $('.notificationLink').addClass('notify_active');
//            }
////            if (jsonData.numberOfNewRequest > 0 && $(".notificationPanelin").scrollTop() == 0) {
////                $('.notificationPanelin').attr('from_index', parseInt(param_index) + 10);
////            }
//
//            if (noti_counter > 0) {
//                $('.notificationPanelin').attr('from_index', parseInt(param_index) + noti_counter);
//            }
//            if($('.notificationPanelin').attr('from_index') == "NaN"){
//                console.log($('.notificationPanelin').attr('from_index'))
//            }
//        } else {
//            $('.notificationPanelCounter').hide();
//        }
//        $('.notificationPanelin').html(notificationPanelBody);
//    },
    agent_notification_1: function (jsonData) {
        $('#showmore_noti_loading').css('display', 'none');
        var notificationPanelBody = ""; // = $('.notificationPanel').html();
        if ($('.notificationPanelin').html() != 'undefined') {
            notificationPanelBody = $('.notificationPanelin').html();
        }
        if (jsonData.sucs) {
            var jData = JSON.parse(jsonData.mg);
            var noti_counter = 0;

            var param_index = $('.notificationPanelin').attr('from_index');
            var v_content;
            var v_li_array_list = $('.notificationPanelin').children();
            for (var i = 0; i < jData.length; i++) {
                var json = jData[i];
                var now = new Date(json.ut);
                var time = now.customFormat(dateformate);
                if (param_index == 0 && i == 0) {
                    $('.notificationPanelin').attr('latest_noti_up_time', json.ut);
                }

//                $($0).children()[0].outerHTML = $($0).children()[0].outerHTML
                if (v_li_array_list.length > 0) {
                    v_content = "<li data-time=\"" + json.ut + "\" class=\"" + json.acId + json.mt + "\" onclick=\"utils.DeleteNotifications('" + json.acId + "','" + json.id + "')\"><div style=\"width:50px; height:50px; float:left;\"><img class=\"pull-left\" src=\"" + base_url + "/images/profile_bg_40.png\" alt=\"\" /> </div>" +
                            "<div style=\"float:right; width:250px\"><p>" + json.message + "</p>" +
                            "<p class=\"time\">" + ' <span class="glyphicon glyphicon-time"></span>s ' + " " + time + " " + "</p></div>" +
                            "<div class=\"clear\"></div></li>";

                    if (json.ut > v_li_array_list[0].attributes['data-time'].value) {
//------------------------------------ The new comer (notification) is the most recent, among all the notifications which are currently being displayed. ---------------------
                        v_li_array_list[0].outerHTML = v_content + v_li_array_list[0].outerHTML;
                    } else if (json.ut < v_li_array_list[v_li_array_list.length - 1].attributes['data-time'].value) {
//------------------------------------ The new comer (notification) is the oldest, among all the notifications which are currently being displayed. ---------------------
                        v_li_array_list[v_li_array_list.length - 1].outerHTML = v_li_array_list[v_li_array_list.length - 1].outerHTML + v_content;
                    } else {
//------------------------------------ The new comer (notification) should be inserted at somewhere in the middle of the existing notificationList --------------------- 
                        var v_lower_index = 0;
                        var v_upper_index = v_li_array_list.length - 1;
                        var v_dif = v_upper_index - v_lower_index;
                        var v_index = (v_dif % 2 == 0 ? v_dif / 2 : Math.ceil(v_dif / 2));
                        while (true) {
                            if (v_li_array_list[v_index].attributes['data-time'].value < json.ut) {
                                v_upper_index = v_index - 1;
                                v_dif = v_upper_index - v_lower_index;
                                if (v_dif <= 1) {
                                    v_li_array_list[v_lower_index].outerHTML = v_li_array_list[v_lower_index].outerHTML + v_content;
                                    break;
                                }
                                v_index = v_upper_index - (v_dif % 2 == 0 ? v_dif / 2 : Math.ceil(v_dif / 2));
                            } else if (v_li_array_list[v_index].attributes['data-time'].value > json.ut) {
                                v_lower_index = v_index + 1;
                                v_dif = v_upper_index - v_lower_index;
                                if (v_dif == 1) {
                                    v_li_array_list[v_lower_index].outerHTML = v_li_array_list[v_lower_index].outerHTML + v_content;
                                    break;
                                }
                                v_index = v_lower_index + (v_dif % 2 == 0 ? v_dif / 2 : Math.ceil(v_dif / 2));
                            } else if (v_li_array_list[v_index].attributes['data-time'].value == json.ut) {
                                v_li_array_list[v_index].outerHTML = v_content + v_li_array_list[v_index].outerHTML;
                                break;
                            }
                        }
                    }
                    v_li_array_list = $('.notificationPanelin').children();
                } else {
                    notificationPanelBody = notificationPanelBody +
                            "<li data-time=\"" + json.ut + "\" class=\"" + json.acId + json.mt + "\" onclick=\"utils.DeleteNotifications('" + json.acId + "','" + json.id + "')\"><div style=\"width:50px; height:50px; float:left;\"><img class=\"pull-left\" src=\"" + base_url + "/images/profile_bg_40.png\" alt=\"\" /> </div>" +
                            "<div style=\"float:right; width:250px\"><p>" + json.message + "</p>" +
                            "<p class=\"time\">" + ' <span class="glyphicon glyphicon-time"></span> ' + " " + time + " " + "</p></div>" +
                            "<div class=\"clear\"></div></li>";
                    $('.notificationPanelin').html(notificationPanelBody);
                }
                noti_counter++;
            }
//            if (jsonData.numberOfNewRequest > 0 && $(".notificationPanel").scrollTop() == 0) {
            if (jsonData.numberOfNewRequest > 0 && $(".notificationPanel").scrollTop() == 0) {
                $('.notificationPanelCounter').text(jsonData.numberOfNewRequest);
//                $('.fakeTagFornotificationPanelCounter').html('');
                $('.notificationLink').removeClass('notify');
                $('.notificationLink').addClass('notify_active');
            }

            if (noti_counter > 0) {
                $('.notificationPanelin').attr('from_index', parseInt(param_index) + noti_counter);
            }
            if ($('.notificationPanelin').attr('from_index') == "NaN") {
                console.log($('.notificationPanelin').attr('from_index'))
            }
        } else {
            $('.notificationPanelCounter').hide();
        }
    },
//    agent_notification: function (jsonData) {
//        console.dir(jsonData)
//        var notificationPanelBody = ""; // = $('.notificationPanel').html();
//        if ($('.notificationPanelin').html() != 'undefined') {
//            notificationPanelBody = $('.notificationPanelin').html();
//        }
//        if (jsonData.sucs) {
//            var jData = JSON.parse(jsonData.mg);
//            for (var index = 0; index < jData.length; index++) {
//                var json = jData[index];
//                if ($('.' + json.acId + json.mt).length) {
//                    $('.' + json.acId + json.mt).remove();
//                }
//                var now = new Date(json.ut);
//                var time = now.customFormat(dateformate);
//                notificationPanelBody = "<li class=\"" + json.acId + json.mt + "\" onclick=\"utils.DeleteNotifications('" + json.acId + "','" + json.id + "')\"><div style=\"width:50px; height:50px; float:left;\"><img class=\"pull-left\" src=\"" + base_url + "/images/profile_bg_40.png\" alt=\"\" /> </div>" +
//                        "<div style=\"float:right; width:250px\"><p>" + json.message + "</p>" +
//                        "<p class=\"time\">" + ' <span class="glyphicon glyphicon-time"></span> ' + " " + time + " " + "</p></div>" +
//                        "<div class=\"clear\"></div></li>" + notificationPanelBody;
////                notificationPanelBody =
////                        "<li class=\"" + json.acId + json.mt + "\" onclick=\"utils.DeleteNotifications('" + json.acId + "','" + json.ids + "')\"><img class=\"pull-left\" src=\"" + base_url + "/images/notify.png\" alt=\"\" />" +
////                        "<p>" + json.message + "</p>" +
////                        "<div class=\"clear\"></div></li>" + notificationPanelBody;
//            }
////                    alert(jsonData.numberOfNewRequest)
//            //&& $(".notificationPanel").scrollTop() == 0
//            if (jsonData.numberOfNewRequest > 0) {
//                $('.notificationPanelCounter').text('' + jsonData.numberOfNewRequest);
//                $('.notificationPanelCounter').show();
//                $('.fakeTagFornotificationPanelCounter').html('');
//                $('.notificationLink').removeClass('notify');
//                $('.notificationLink').addClass('notify_active');
//            }
//
//            $('.notificationPanelin').html(notificationPanelBody);
//        }
//    },
    DeleteNotifications: function (activityId, targetIds) {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: base_url + "/ReDirectToNotificationDetails",
            data: {
                time: new Date().getMilliseconds(),
                idsToBeDeleted: targetIds
            },
            success: function (jsonData) {
                if (jsonData.sucs) {
//                    if (activityId != 0) {
//                        $('.' + activityId + jsonData.mt).hide();
//                    } else {
////                        alert('zero')
//                    }

                    if (jsonData.mt == '1' || jsonData.mt == '2' || jsonData.mt == '3' || jsonData.mt == '4') { //profile (1 & 2) add friend/accept friend (3 & 4)
                        window.location = base_url + "/secure/user/friend/profile.xhtml?friend=" + jsonData.fndId;
                    } else if (jsonData.mt == '5') {
//                        alert('Not implemented yet');                        
//                        window.location = base_url + "/secure/group/details.xhtml?grpId=" + jsonData.acId;
                        window.location = base_url + "/secure/group/circle_home.xhtml?grpId=" + jsonData.acId;
                    } else if (jsonData.mt == '6') {
                        window.location = base_url + "/secure/user/newsfeed_comments.xhtml?activityId=" + activityId + "&ut=" + jsonData.ut + "&mt=" + jsonData.mt;
//                        utils.getStatusNotificationDetails(activityId, jsonData.ut, jsonData.mt);
//                        window.location = base_url + "/secure/user/newsfeed_comments.xhtml";
                    } else if (jsonData.mt == '7') {
                        window.location = base_url + "/secure/user/newsfeed_likes.xhtml?activityId=" + activityId + "&ut=" + jsonData.ut + "&mt=" + jsonData.mt;
//                        utils.getStatusNotificationDetails(activityId, jsonData.ut, jsonData.mt);
                    } else if (jsonData.mt == '8') {
                        jAlert('LIKE_COMMENT :: not implemented')
//                        utils.getStatusNotificationDetails(activityId, jsonData.ut, jsonData.mt);
                    } else if (jsonData.mt == '9') {
                        jAlert('ADD_COMMENT_ON_COMMENT :: not implemented')
//                        utils.getStatusNotificationDetails(activityId, jsonData.ut, jsonData.mt);
                    } else if (jsonData.mt == '10') {
                        jAlert('SHARE_STATUS :: not implemented')
//                        utils.getStatusNotificationDetails(activityId, jsonData.ut, jsonData.mt);
                    } else if (jsonData.mt == '11') {
                        jAlert('LIKE_IMAGE :: not implemented')
//                        utils.getStatusNotificationDetails(activityId, jsonData.ut, jsonData.mt);
                    }
                }
            },
            error: function (e, m, s) {
//                alert('error !! --> ' + e.responseText)
            }
        });
    },
    getStatusNotificationDetails: function (param_activityId, updateTime, messageType) {
        $.ajax({
            type: 'post',
            url: base_url + '/GetStatusNotificationDetails',
            dataType: 'json',
            data: {
                activityId: param_activityId,
                time: updateTime
            },
            success: function (json) {
//                console.log('## json --->> ' + json)
                var v_img_list = eval('(' + json.imageList + ')');
                if (messageType == '7') {
                    if (json != null && json.sucs == true) {
                        $('.newsfeed').css('display', 'block');
                        $('.newsfeed').attr('id', 'newsfeedId' + json.nfId);
                        //1
                        var status_owner_pp_content = "<img src=\"" + json.ownerImageURL + "\" class=\"img-circle\" alt=\"\"/>";
                        $('#status_owner_pp').html(status_owner_pp_content);
                        if (!json.delAlwd) {
                            //2
                            $('#status_delete_btn').replaceWith('');
                            //3
                            var status_header_content = "<span class=\"name\"><a href=\"" + base_url + "/secure/user/friend/profile.xhtml?friend=" + json.uId + "\">" + json.fn + " " + json.ln + "</a></span> updated status";
                            $('#status_header').html(status_header_content);
                        } else {
                            //2
                            //do Nothing
                            $('#status_delete_btn').attr('nfId', 'newsfeedId' + json.nfId);
                            //3
                            var status_header_content = "<span class=\"name\"><a href=\"" + base_url + "/secure/user/profile/myid.xhtml\">" + json.fn + " " + json.ln + "</a></span> updated status";
                            $('#status_header').html(status_header_content);
                        }

                        //4
                        var status_details_content = "<p>" + json.sts + "</p>";
                        if (json.type == 1) {
                            status_details_content += "<div class=\"thumbnail\"><img src=\"" + utils.getProperImageUrl(v_img_list[0].iurl) + "\" /></div></div>";
                        }

//                        status_details_content += "";

                        $('#status_details').html(status_details_content);
//                        window.location = base_url + "/secure/user/newsfeed_likes.xhtml";

                        //5
                        $('#no_of_likes').text(json.nl);
                        //6
                        $('#no_of_comments').text(json.nc);
                        //7
                        var il;
                        if (json.il === 1) {
                            il = vUnLike;
                        } else {
                            il = vLike;
                        }
                        $('.like_button').text(il);
                        //8
                        var nfId = $('.newsfeed').attr('id');
                        utils.getLikesOnStatusDetails(json.uId, nfId, true)
                    }
                }
                else if (messageType == '6') {
                    if (json != null && json.sucs == true) {
                        $('.newsfeed').css('display', 'block');
                        $('.newsfeed').attr('id', 'newsfeedId' + json.nfId);
                        $('.add_commnet').attr('nfId', +json.nfId);
                        //1
                        var status_owner_pp_content = "<img src=\"" + json.ownerImageURL + "\" class=\"img-circle\" alt=\"\"/>";
                        $('#status_owner_pp').html(status_owner_pp_content);
                        if (!json.delAlwd) {
                            //2
                            $('#status_delete_btn').replaceWith('');
                            //3
                            var status_header_content = "<span class=\"name\"><a href=\"" + base_url + "/secure/user/friend/profile.xhtml?friend=" + json.uId + "\">" + json.fn + " " + json.ln + "</a></span> updated status";
                            $('#status_header').html(status_header_content);
                        } else {
                            //2
                            //do Nothing
                            $('#status_delete_btn').attr('nfId', 'newsfeedId' + json.nfId);
                            //3
                            var status_header_content = "<span class=\"name\"><a href=\"" + base_url + "/secure/user/profile/myid.xhtml\">" + json.fn + " " + json.ln + "</a></span> updated status";
                            $('#status_header').html(status_header_content);
                        }

                        //4
                        var status_details_content = "<p>" + json.sts + "</p>";
                        if (json.type == 1) {
                            status_details_content += "<div class=\"thumbnail\"><img src=\"" + utils.getProperImageUrl(json.iurl) + "\" /></div></div>";
                        }

//                        status_details_content += "";

                        $('#status_details').html(status_details_content);
//                        window.location = base_url + "/secure/user/newsfeed_likes.xhtml";

                        //5
                        $('#no_of_likes').text(json.nl);
                        //6
                        $('#no_of_comments').text(json.nc);
                        //7
                        var il;
                        if (json.il === 1) {
                            il = vUnLike;
                        } else {
                            il = vLike;
                        }
                        $('.like_button').text(il);
                        //8
                        var cntnt = "<span class=\"glyphicon glyphicon-time\"></span> " + json.tm;
                        $('#status_time').html(cntnt);
                        //9
                        var nfId = $('.newsfeed').attr('id');
                        $('.comment-list').attr('nfId', '' + nfId);
                        $('.comment-list').attr('param_uId', '' + json.uId);
                        $('.comment-list').attr('delAlwd', '' + json.delAlwd);
                        utils.getCommentsOnStatusDetails(nfId, json.uId, json.delAlwd, 0);
                    }
                }
            },
            error: function (e, m, s) {
//                alert('error in getStatusNotificationDetails --> ' + e.responseText)
            }
        });
    },
    getLikesOnStatusDetails: function (uId, nfId, isFirstTime) {
        var v_startingIndex = parseInt($('.comment-list').attr('index'));
//        alert(v_startingIndex)
        $.ajax({
            url: base_url + "/GetLikes",
            type: 'post',
            dataType: 'json',
            data: {
                nfId: nfId,
                startingIndex: v_startingIndex
            },
            success: function (jsonData) {
                var counter = v_startingIndex;
                var temp_counter = 0;
                if (jsonData.sucs) {
//------------------------------------ like portion (start) -----------------------------                    
                    var jData = eval('(' + jsonData.mg + ')');
                    var content;
                    var add_friend_content = "";
                    for (var index = 0; index < jData.length; index++) {
                        console.log('index in getLikesOnStatusDetails --> ' + index)
                        var innerJson = jData[index];
                        console.log('frnS ---> ' + innerJson.frnS);
                        if (innerJson.deleted) {
                            $('.cmntListUID' + innerJson.uId).remove();
                        } else {
                            if (innerJson.frnS == '-1') {
                                add_friend_content = "<div class=\"pull-right\"><img width=\"20\" src=\"" + base_url + "/images/add_friend.png\" onclick=\"javascript:friends.sendFriendRequest('" + innerJson.uId + "',true)\"/></div>";
                            }
                            console.log('uId ---> ' + innerJson.uId);
                            console.log('prIm ---> ' + innerJson.prIm);
                            var profile_link_content = "";
                            if (uId == innerJson.uId) {
                                profile_link_content = "<a style='color: black' href=\"" + base_url + "/secure/user/profile/myid.xhtml\">";
                            } else {
                                profile_link_content = "<a style='color: black' href='" + base_url + "/secure/user/friend/profile.xhtml?friend=" + innerJson.uId + "'>";
                            }
                            var own_like_entry_class = "";
                            if (jsonData.myId == innerJson.uId) {
                                own_like_entry_class = 'own_like_entry';
                                if ($('.own_like_entry').length != 0) {
                                    $('.own_like_entry').remove();
                                    temp_counter--;
                                    counter--;
                                }
                            }
                            content = "<li class=\"item " + own_like_entry_class + "  cmntListUID" + innerJson.uId + "\"><div class=\"pad_ten\">" +
                                    "<a href=\"#\" class=\"pull-left profile_img_bg_50\">" +
                                    "<img width=\"50\" height=\"50\" alt=\"...\" src=\"" + utils.getImageWithSize('thumb', 'http://38.108.92.154/auth/clients_image/' + innerJson.prIm) + "\" class=\"media-object img-circle\" />  " +
                                    "</a>" +
                                    add_friend_content +
                                    "<div class=\"media-body\"><h6>" + profile_link_content + innerJson.fn + " " + innerJson.ln + "</a></h6></div><div class=\"clear\"></div></div></li>";
                            if ($('.cmntListUID' + innerJson.uId).length == 0) {
                                $('.comment-list').append(content);
                                temp_counter++;
                                counter++;
                            } else {
                                $('.cmntListUID' + innerJson.uId).replaceWith(content);
                            }

                        }
                    }
                    $('.comment-list').attr('index', '' + counter);
                    if (!isFirstTime) {
                        var prev_no_of_likes = $('#no_of_likes').text();
                        $('#no_of_likes').text(parseInt(prev_no_of_likes) + temp_counter);//original code
//                        $('#no_of_likes').text(counter);//for testing purpose
                    }
//------------------------------------ like portion (End) -----------------------------                    
//------------------------------------ unLike portion (start) -----------------------------
                    if (jsonData.alt_mg !== null) {
                        var junLikeData = eval('(' + jsonData.alt_mg + ')');
                        var unLikeCounter = 0;
                        if (junLikeData !== null) {
                            for (var index = 0; index < junLikeData.length; index++) {
                                var innerJson = junLikeData[index];
                                if ($('.cmntListUID' + innerJson.uId).length > 0) {
                                    $('.cmntListUID' + innerJson.uId).remove();
                                    unLikeCounter++;
                                }
                            }
                            if (!isFirstTime) {
                                var prev_no_of_likes = $('#no_of_likes').text();
                                $('#no_of_likes').text(parseInt(prev_no_of_likes) - unLikeCounter);//original code
                            }
                            var p = +counter - unLikeCounter;
                            $('.comment-list').attr('index', '' + p);
                        }
                    }
//------------------------------------ unLike portion (End) -----------------------------
                }
            }, error: function (e, m, s) {
//                alert(e.responseText)
            }
        });

        setTimeout(function () {
            utils.getLikesOnStatusDetails(uId, nfId, false);
        }, 15000)
    },
    getCommentsOnStatusDetails: function (nfId_property, uId, delAlwd, param_starting_index) {
//        alert(param_starting_index)
        $.ajax({
            url: base_url + "/GetComments",
            type: 'post',
            dataType: 'json',
            data: {
                nfId: nfId_property,
                startingIndex: param_starting_index
            },
            success: function (jsonData) {
//                                if (jsonData.sucs) {
//                                    utils.getCommentsOnStatusDetails(nfId, json.uId, json.delAlwd);
//                                }
//                var counter = parseInt($('.comment-list').attr('index'));
                var counter = parseInt($('.comment-list').attr('index'));
                if (jsonData.sucs) {
//                    alert('Inside success -----> ' + counter + ' --> ' + jsonData.mg);
                    var jData = eval('(' + jsonData.mg + ')');
                    var content;
//                                    var add_friend_content = "";
                    for (var index = 0; index < jData.length; index++) {
                        var innerJson = jData[index];
                        // console.log('json.cmnId ---> ' + innerJson.cmnId);
//                                        if (json.frnS == '-1') {
//                                            add_friend_content = "<div class=\"pull-right\"><img width=\"20\" src=\"" + base_url + "/images/add_friend.png\" onclick=\"javascript:friends.sendFriendRequest('" + json.uId + "',true)\"/></div>";
//                                        }
//                                        alert(innerJson.prIm)
                        var edit_delete_content = "";
//                                        alert('asd --> ' + innerJson.cmnId)
                        var commnetId = "commentId" + innerJson.cmnId;
                        var newsFeedId = nfId_property;
                        if (uId == innerJson.uID) {
                            edit_delete_content = "<span class=\"caret\"></span></a><ul aria-labelledby=\"dropdownMenu1\" role=\"menu\" class=\"dropdown-menu\">" +
                                    "<li role=\"presentation\"><a href=\"#\" tabindex=\"-1\" role=\"menuitem\"  nfId=\"" + nfId_property + "\" cmnId=\"" + commnetId + "\"  class=\"edit_commnet\">Edit</a></li>" +
                                    "<li role=\"presentation\"><a href=\"#\" tabindex=\"-1\" role=\"menuitem\"  nfId=\"" + nfId_property + "\" cmnId=\"" + commnetId + "\"  class=\"comment_delete_button\" >Delete</a></li>" +
                                    "</ul>";
                        } else if (delAlwd) {
                            edit_delete_content = "<span class=\"caret\"></span></a><ul aria-labelledby=\"dropdownMenu1\" role=\"menu\" class=\"dropdown-menu\">" +
                                    "<li role=\"presentation\"><a href=\"#\" tabindex=\"-1\" role=\"menuitem\"  nfId=\"" + nfId_property + "\" cmnId=\"" + commnetId + "\"  class=\"comment_delete_button\">Delete</a></li>" +
                                    "</ul>";
                        }

                        var profile_link_content = "";
                        if (uId == innerJson.uId) {
                            profile_link_content = "<a style='color: black' href=\"" + base_url + "/secure/user/profile/myid.xhtml\">";
                        } else {
                            profile_link_content = "<a style='color: black' href='" + base_url + "/secure/user/friend/profile.xhtml?friend=" + innerJson.uId + "'>";
                        }

                        var now = new Date(innerJson.tm);
                        var time = now.customFormat(dateformate);
                        var like_unLike = vLike;
                        var like_unLike_icon = 'like_icon';
                        if (innerJson.il == 1) {
                            like_unLike = vUnLike;
                            like_unLike_icon = 'like_active';
                        }
                        content = "<li id=\"commentId" + innerJson.cmnId + "\" class=\"item cmntDet" + innerJson.uId + " commentId" + innerJson.cmnId + "\"><div class=\"pad_ten\">" +
                                "<a class=\"pull-left profile_img_bg_30\" href=\"#\" style=\"margin-right:5px;\">" +
                                "<img class=\"img-circle\" src=\"" + utils.getImageWithSize('thumb', utils.getProperImageUrl(innerJson.prIm)) + "\" alt=\"\" width=\"40\" />" +
                                "</a><div class=\"dropdown pull-right\">" +
                                "<a data-toggle=\"dropdown\" id=\"dropdownMenu1\" class=\"dropdown-toggle\" href=\"#delete\">" +
                                edit_delete_content +
                                "</div><div class=\"media-body\" style=\"margin-left:10px;\"><h6>" + profile_link_content + innerJson.fn + " " + innerJson.ln + "</a></h6>" +
                                "<p>" + innerJson.cmn + "</p><span>" + time + "</span>" +
                                "</div><div class=\"clear\"></div></div><ul class=\"share-menu\">" +
                                "<li><a class=\"commnet_like_button \" href=\"javascript:void(0)\">" + like_unLike + "</a></li>" +
                                "<li><a class=\"" + like_unLike_icon + " jLikeCounter\" data-toggle=\"modal\" data-target=\"#likeModal\" href=\"#\">" + innerJson.nl + "</a></li></ul></li>";
//                                        content = "<li class=\"item\"><div class=\"pad_ten\">" +
//                                                "<a href=\"#\" class=\"pull-left profile_img_bg_50\">" +
//                                                "<img width=\"50\" height=\"50\" alt=\"...\" src=\"" + utils.getImageWithSize('thumb', 'http://38.108.92.154/auth/clients_image/' + json.prIm) + "\" class=\"media-object img-circle\" />  " +
//                                                "</a>" +
//                                                add_friend_content +
//                                                "<div class=\"media-body\"><h6>" + json.fn + " " + json.ln + "</h6></div><div class=\"clear\"></div></div></li>";

                        if ($('#commentId' + innerJson.cmnId).length == 0) {
                            if (param_starting_index == 0) {
                                $('.comment-list').prepend(content);
                            }
                            else {
                                $('.JcommentsPad' + nfId_property).before(content);
                            }
                            counter++;
                        } else {
                            $('#commentId' + innerJson.cmnId).replaceWith(content);
                        }
                    }

//------------------------------------ jEditOrDelete portion (start) -----------------------------
                    var jEditOrDeleteCommentData = eval('(' + jsonData.alt_mg + ')');
//                    var deleteCounter = 0;
                    for (var index = 0; index < jEditOrDeleteCommentData.length; index++) {
                        var innerJson1 = jEditOrDeleteCommentData[index];
//                        console.log('.commentId' + innerJson1.cmnId)
                        if ($('.commentId' + innerJson1.cmnId).length > 0) {
                            $('.commentId' + innerJson1.cmnId).remove();
//                            deleteCounter = deleteCounter + 1;
//                            alert('1 --> ' + counter);
                            counter = counter - 1;
//                            alert('2 --> '+counter);
                        } else {
//                            console
                        }
                    }
//------------------------------------ jEditOrDelete portion (End) -----------------------------                    
//                    alert(counter)
//                    alert(deleteCounter)
//                    if (deleteCounter > 0) {
//                        counter = counter - deleteCounter;
//                    }
                    if (counter != parseInt($('.comment-list').attr('index'))) {
                        $('.comment-list').attr('index', '' + counter);
                        $("#showmore_cmnt_loading").show();
                    } else {
                        $("#showmore_cmnt_loading").hide();
                    }
                }
//                alert(counter+'=======99')

            }, error: function (e, m, s) {
//                alert(e.responseText)
            }
        });

        setTimeout(function () {
            utils.getCommentsOnStatusDetails(nfId_property, uId, delAlwd, $('.comment-list').attr('index'));
        }, 15000)
    },
//    getCommentsOnStatusDetails: function(nfId, param_uId, delAlwd) {
//        $.ajax({
//            url: base_url + "/FetchCommentsDetails",
//            type: 'post',
//            dataType: 'json',
//            data: {
//                nfId: nfId,
//                startingIndex: 0
//            },
//            success: function(jsonData) {
////                alert(jsonData)
//                var counter = parseInt($('.comment-list').attr('index'));
//                if (jsonData.sucs) {
//                    var jData = eval('(' + jsonData.mg + ')');
////                    console.log('jsonData.mg ---> ' + jsonData.mg)
//                    var content;
//                    for (var index = 0; index < jData.length; index++) {
//                        var innerJson = jData[index];
////                        console.log('json.cmnId ---> ' + innerJson.cmnId);
//                        var edit_delete_content = "";
//                        var commnetId = "commentId" + innerJson.cmnId;
//                        var newsFeedId = 'newsfeedId' + nfId;
//                        if (param_uId == innerJson.uID) {
//                            edit_delete_content = "<span class=\"caret\"></span></a><ul aria-labelledby=\"dropdownMenu1\" role=\"menu\" class=\"dropdown-menu\">" +
//                                    "<li role=\"presentation\"><a href=\"#\" tabindex=\"-1\" role=\"menuitem\"  nfId=\"" + newsFeedId + "\" cmnId=\"" + commnetId + "\"  class=\"edit_commnet\">Edit</a></li>" +
//                                    "<li role=\"presentation\"><a href=\"#\" tabindex=\"-1\" role=\"menuitem\"  nfId=\"" + newsFeedId + "\" cmnId=\"" + commnetId + "\"  class=\"comment_delete_button\" >Delete</a></li>" +
//                                    "</ul>";
//                        } else if (delAlwd) {
//                            edit_delete_content = "<span class=\"caret\"></span></a><ul aria-labelledby=\"dropdownMenu1\" role=\"menu\" class=\"dropdown-menu\">" +
//                                    "<li role=\"presentation\"><a href=\"#\" tabindex=\"-1\" role=\"menuitem\"  nfId=\"" + newsFeedId + "\" cmnId=\"" + commnetId + "\"  class=\"comment_delete_button\">Delete</a></li>" +
//                                    "</ul>";
//                        }
//
//                        var profile_link_content = "";
//                        if (param_uId == innerJson.uId) {
//                            profile_link_content = "<a style='color: black' href=\"" + base_url + "/secure/user/profile/myid.xhtml\">";
//                        } else {
//                            profile_link_content = "<a style='color: black' href='" + base_url + "/secure/user/friend/profile.xhtml?friend=" + innerJson.uId + "'>";
//                        }
//
//                        var now = new Date(innerJson.tm);
//                        var time = now.customFormat(dateformate);
//                        var like_unLike = 'Like';
//                        var like_unLike_icon = 'like_icon';
//                        if (innerJson.il == 1) {
//                            like_unLike = 'Unlike';
//                            like_unLike_icon = 'like_active';
//                        }
//                        content = "<li id=\"commentId" + innerJson.cmnId + "\" class=\"item cmntDet" + innerJson.uId + "\"><div class=\"pad_ten\">" +
//                                "<a class=\"pull-left profile_img_bg_30\" href=\"#\" style=\"margin-right:5px;\">" +
//                                "<img class=\"img-circle\" src=\"" + utils.getImageWithSize('thumb', innerJson.prIm) + "\" alt=\"\" width=\"40\" />" +
//                                "</a><div class=\"dropdown pull-right\">" +
//                                "<a data-toggle=\"dropdown\" id=\"dropdownMenu1\" class=\"dropdown-toggle\" href=\"#delete\">" +
//                                edit_delete_content +
//                                "</div><div class=\"media-body\" style=\"margin-left:10px;\"><h6>" + profile_link_content + innerJson.fn + " " + innerJson.ln + "</a></h6>" +
//                                "<p>" + innerJson.cmn + "</p><span>" + time + "</span>" +
//                                "</div><div class=\"clear\"></div></div><ul class=\"share-menu\">" +
//                                "<li><a class=\"commnet_like_button \" href=\"javascript:void(0)\">" + like_unLike + "</a></li>" +
//                                "<li><a class=\"" + like_unLike_icon + " jLikeCounter\" data-toggle=\"modal\" data-target=\"#likeModal\" href=\"#\">" + innerJson.nl + "</a></li></ul></li>";
//                        if ($('#commentId' + innerJson.cmnId).length) {
//                            $('#commentId' + innerJson.cmnId).remove();//(content);
//                            //                            $('.comment-list').before(content);
//                        }
//                        //                        else {
//                        $('.comment-list').before(content);
////                        }
//                        counter++;
//                    }
//                    $('.comment-list').attr('index', '' + counter - 1);
//                    $('.comment-list').attr('nfId', '' + nfId);
//                    $('.comment-list').attr('param_uId', '' + param_uId);
//                    $('.comment-list').attr('delAlwd', '' + delAlwd);
//                }
//            }, error: function(e, m, s) {
//                alert(e.responseText)
//            }
//        });
//
//
//
//        setTimeout(function() {
//            utils.getCommentsOnStatusDetails(nfId, param_uId);
//        }, 5000);
//    },
    clearNewRequestCounter: function () {
        $('.newRequestCounter').hide();
        $('.fakeTagForNewRequestCounter').html('x');
        $('.newRequestLink').removeClass('friends_active');
        $('.newRequestLink').addClass('friends');
    },
    clearNotificationPanelCounter: function () {
        $('.notificationPanelCounter').hide();
        $('.fakeTagFornotificationPanelCounter').html('x');
        $('.notificationLink').removeClass('notify_active');
        $('.notificationLink').addClass('notify');
        $.ajax({
            type: 'POST',
            data: {},
            url: base_url + "/DecreaseNotificationCounter",
            success: function (retVal) {
            },
            error: function (e, m, s) {
//                alert('clearNotificationPanelCounter --> ' + e.responseText)
            }
        });
    },
    mailSelection: function () {
        var counter = 0;
        $(".checkBox").each(function (index) {
            if ($(this).prop('checked')) {
                counter = counter + 1;
            }
        });
        if (counter == 0) {
            $(".jMoveMessageButton").hide();
        } else {
            $(".jMoveMessageButton").show();
        }

        utils.printDynamicIds();
    },
    callSpinner: function (obj) {
        var opts = {
            lines: 10, // The number of lines to draw
            length: 7, // The length of each line
            width: 4, // The line thickness
            radius: 10, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px                          
        };
        var target = document.getElementById(obj);
        spinner.spin(target);
    },
    stopSpinner: function () {
        spinner.stop();
    },
    GetURLParameter: function (sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++)
        {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam)
            {
                return sParameterName[1];
                //                            break;
            }
        }
    },
    htmlContentRead: function (partRowIndex) {
        $.ajax({
            type: 'POST',
            url: base_url + '/retrieveDisplayPartContentServlet.svl',
            data: {
                time: new Date().getMilliseconds(),
                partNumber: partRowIndex
            },
            success: function (retVal) {
                //console.log('success')
                //                alert(retVal)
                $('#thisIshtmlValueHolder').html(retVal);
            },
            error: function (e, m, s) {
//                alert('error --> ' + e.responseText)
            }
        });
    },
    changeSelectedMenuCSS: function () {
        $('.myid_submenu').removeClass('sel');
        $(this).addClass('sel');
    },
    showProfileImage: function (fndId) {
        var date1 = new Date();
        var last_response = $.cookie('_l_r_f' + fndId);

        if (last_response === null) {
            $.cookie('_l_r_f' + fndId, date1.getTime());
            // console.log("Returned with true");
            return true;
        }
        date2 = new Date(parseInt(last_response));
        var hours = Math.abs(date1 - date2) / 3600000;
        //console.log('date1 : '+ date1.toDateString() +" date2 : "+ date2.toDateString() + " Hours : "+hours );
        return hours > 4;
    },
    nl2br: function (str, is_xhtml) {
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    },
    getId: function () {
        return 'a';
    },
    printDynamicIds: function () {
        var checkBoxIds = [];
        var i = 0;
        var first = true;
        $('input[type="checkbox"]').each(function () {
            if (!first) {
                checkBoxIds[i++] = $(this).prop('id');
            }
            first = false;
        });
        i = 0;
        $('.class_for_label').each(function () {
            $(this).prop('for', checkBoxIds[i++]);
        });
    },
    replaceEmoticons: function (msg) {
        for (key in emoticons_map) {
            var obj = emoticons_map[key];
            if (msg.toString().contains(key.toString())) {
                var imgTag = "<img class=\"emoticons\" src=\"{PH}\" alt=\"{AL}\" title=\"{AL}\" />";
                var simgTag = "<img class=\"emoticons\" src=\"{PH}\" alt=\"{AL}\" title=\"{AL}\" width='25' height='25' />";
                var placeHolder = "{PH}";
                var altHolder = "{AL}";
                if (obj.type === 0) {
                    simgTag = simgTag.replace(altHolder, obj.symbol);
                    simgTag = simgTag.replace(altHolder, obj.symbol);
                    msg = msg.replace(key.toString(), simgTag.replace(placeHolder, obj.url));
                } else if (obj.type === 1) {
                    imgTag = imgTag.replace(altHolder, obj.symbol);
                    imgTag = imgTag.replace(altHolder, obj.symbol);
                    msg = msg.replace(key.toString(), imgTag.replace(placeHolder, obj.url));
                }
            }
        }
        return msg;
    },
    getCoverImage: function (param_friend_id) {

//        $('#coverImageDiv').click(function (e) {
//            // e.stopPropagation();
//            //console.dir(e.target);
//            // console.dir(e.target);
//            if ($('#albumModal').is(e.target)
//                    || $('#albumModal').has(e.target).length > 0
//                    || $('#coverimageoptions').has(e.target).length > 0
//                    || $('#personel_page_proimage').is(e.target)
//                    || $('#personel_page_proimage').has(e.target).length > 0
//                    || $('#frndProfileDiv').has(e.target).length > 0
//                    || $('#frndProfileMenu').has(e.target).length > 0
//                    ) {
//                // alert("not popup");
//            } else {
//                // alert("popup");
//                //  e.preventDefault();
//                $('#' + $(this).data('key'))[0].click();
//            }
//
//        });

        $.ajax({
            type: 'POST',
            url: base_url + "/getCoverImages",
            dataType: 'json',
            data: {
                friend_id: param_friend_id
            },
            success: function (data, textStatus, jqXHR) {
                if (data != undefined && data != null) {
                    if (data.sucs) {
                        var jData = eval('(' + data.mg + ')');
                        var frndId = (param_friend_id == "-1" || typeof param_friend_id == "undefined") ? userIdentity : param_friend_id;
                        var i = 1;
                        for (i = 1; i < jData.length; i++) {
                            var jUnitData = jData[i];
//                            $('#cvImg' + (+i)).prop('src', jUnitData.iurl);
                            var link = '<a id="popim-' + jUnitData.id + '" data-toggle="lightbox" data-frnd="' + frndId + '" data-album="coverimage" data-gallery="' + frndId + 'coverimage" class="album-popup-' + userIdentity + 'coverimage" href="' + utils.getProperImageUrl(jUnitData.iurl) + '">';
                            var content = link + '<img  src="' + utils.getImageWithSize('thumb', utils.getProperImageUrl(jUnitData.iurl)) + '" height="90px" width="129px" id="cvImg' + (+i) + '"></a>';
                            $('#cvImg' + (+i)).replaceWith(content);
                        }
                        if (i < 4) {
                            var first = true;
                            for (var j = i; j < 4; j++) {
                                if (first) {
                                    first = false;
                                    var content = '<img  src="' + base_url + '/images/default-cv.jpg" height="90px" width="129px" id="cvImg' + (+i) + '">';
                                    $('#cvImg' + (+j)).replaceWith(content);
                                } else {
                                    var content = '<img  src="' + base_url + '/images/default-old-cov.jpg" height="90px" width="129px" id="cvImg' + (+i) + '">';
                                    $('#cvImg' + (+j)).replaceWith(content);
                                }
                            }
                        }
                    } else {
//                        var current_page = window.location.pathname;
                        var img = $('#coverImageDiv').css('background-image');
                        if (img == 'none') {//empty coverpic
                            $('#coverImageDiv').css('background-image', 'url(' + base_url + '/images/default-cv.jpg)');
                            for (var i = 1; i < 4; i++) {
                                var content = '<img  src="' + base_url + '/images/default-old-cov.jpg" height="90px" width="129px" id="cvImg' + (+i) + '">';
                                $('#cvImg' + (+i)).replaceWith(content);
                            }
                        }
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });
    },
    composeMail: function () {

        var content = '<div class="modal fade" id="compose_mail_left" tabindex="-1" role="dialog" aria-labelledby="albumModal_circleLabel" aria-hidden="true">' +
                '<div class="compose_mail" >' +
                '<div class="modal-dialog">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<div class="pull-left">' +
                '<span  style="color:white; font-size: 600; font-size: 16px">Text Message From ID</span>' +
                '</div>' +
                '<div class="pull-right">' +
                '<input type="button" data-minimize="modal"  name="cancel_create_circle" class="minimize" />' +
                '<input type="button" data-dismiss="modal"  name="cancel_create_circle" class="close" />' +
                '</div>' +
                '<div class="clearfix"></div>' +
                '</div>' +
                '<div class="modal-body">' +
                '<input type="text"   name="" class="mail_addresses" placeholder="To" />' +
                '<input type="text"   name="" class="mail_subject" placeholder="Subject" />' +
                '<textarea class="mail_body" id="ntnc_rhs" type="text" ></textarea>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<div class="pull-left">' +
                '<button class="btn font" />' +
                '<button class="btn com_menu dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" />' +
                '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Print</a></li>' +
                '<li class="divider"></li>' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Check Spelling</a></li>' +
                '<li class="divider"></li>' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Help</a></li>' +
                '</ul>' +
                '<button class="btn attach" />' +
                '</div>' +
                '<div class="pull-right">' +
                '<input type="button"  name="send" id="sendMailModal" class="btn send" value="Send" />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        $('#modalHolder_album').html(content);

        $('#sendMailModal').click(function () {
            $.ajax({
                type: 'POST',
                url: base_url + "/mailoperation",
                cache: true,
                dataType: 'json',
                data: {
                    choice: "send_mail",
                    mail_addresses: $('.mail_addresses').val(),
                    mail_subject: $('.mail_subject').val(),
                    mail_body: $('.mail_body').val()

                },
                success: function (successdata) {
                    console.log(successdata);

                }});
        });


        $('#fakeLinkTocompose_mail_left').click();

        $('#create_album_preview').empty();
        $('#upload_photos_btn').prop('disabled', 'true');
        $('#album_create_done_btn').prop('disabled', 'true');
        $('#success_div').css('display', 'none');
        $('#success_message').text('');
        $('#input_album_name').val('');
        $('#albumImageUploadForm').removeAttr('indexCollectionsToSkip');
    },
    getUniqueID: function (prefix) {
        if (typeof prefix === "undefined")
            prefix = '';
        return prefix + Math.floor(Math.random() * (new Date()).getTime());
    },
    hideLoader: function () {
        $('#showmore_loading').hide();
    }, getOriginalImageUrl: function (param_marker, param_url) {
        param_marker = '/' + param_marker;
        var index = param_url.indexOf(param_marker);
        var v_original_url = param_url.substring(0, index) + '/' + param_url.substring(index + param_marker.length, param_url.length);
        console.log('param_url --> ' + param_url);
        console.log('v_original_url --> ' + v_original_url);
        return v_original_url;
    },
    getImageUploadInfo: function () {

//        console.log('withOut --> ' + sessionStorage.getItem("as"));
//        console.log('with --> ' + $.base64.decode(sessionStorage.getItem("as")));

        if (!(utils.settings.as && utils.settings.ui && utils.settings.si && utils.settings.ap && utils.settings.lru && utils.settings.riih)) {
            console.log('--------------------------- Image Upload Info servlet called ---------------------------');
            $.ajax({
                type: 'POST',
                url: base_url + "/AlbumImageUploadHandler",
                data: {
                    choice: 2
                },
                dataType: 'json',
                success: function (data, textStatus, jqXHR) {
                    utils.settings.as = data.authServer;
                    utils.settings.ui = data.uId;
                    utils.settings.si = data.sId;
                    utils.settings.ap = data.authPort;
                    utils.settings.lru = data.url;
                    utils.settings.riih = true;
//                    Session.set('as', data.authServer);
//                    if (typeof (Storage) !== "undefined") {
//                        sessionStorage.setItem("as", $.base64.encode(data.authServer));
//                        // Code for localStorage/sessionStorage.
//                    } else {
//                        // Sorry! No Web Storage support..
//                    }
// retreive a session value/object
//                    Session.get('as');
//                    console.dir(data);
//                    console.dir(textStatus);
//                    console.dir(jqXHR);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    settings.riih = false;
                }
            });
        }
    }
};

//if (JSON && JSON.stringify && JSON.parse)
//    var Session = Session || (function () {
//
//        // window object
//        var win = window.top || window;
//
//        // session store
//        var store = (win.name ? JSON.parse(win.name) : {});
//
//        // save store on page unload
//        function Save() {
//            win.name = JSON.stringify(store);
//        }
//        ;
//
//        // page unload event
//        if (window.addEventListener)
//            window.addEventListener("unload", Save, false);
//        else if (window.attachEvent)
//            window.attachEvent("onunload", Save);
//        else
//            window.onunload = Save;
//
//        // public methods
//        return {
//            // set a session variable
//            set: function (name, value) {
//                store[name] = value;
//            },
//            // get a session value
//            get: function (name) {
//                return (store[name] ? store[name] : undefined);
//            },
//            // clear session
//            clear: function () {
//                store = {};
//            },
//            // dump session data
//            dump: function () {
//                return JSON.stringify(store);
//            }
//
//        };
//
//    })();