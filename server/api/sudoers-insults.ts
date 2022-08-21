/*
 * SPDX-License-Identifier: ISC
 *
 * Copyright (c) 1996, 1998, 1999 Todd C. Miller <Todd.Miller@sudo.ws>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

// https://github.com/sudo-project/sudo/blob/b0a32fe738af5c20594e2f8320e72f64a83f63c9/plugins/sudoers/ins_2001.h
// HAL insults (paraphrased) from 2001.
const ins_2001 = [
  "Just what do you think you're doing Dave?",
  'It can only be attributed to human error.',
  "That's something I cannot allow to happen.",
  'My mind is going. I can feel it.',
  "Sorry about this, I know it's a bit silly.",
  'Take a stress pill and think things over.',
  'This mission is too important for me to allow you to jeopardize it.',
  'I feel much better now.',
]

// https://github.com/sudo-project/sudo/blob/b0a32fe738af5c20594e2f8320e72f64a83f63c9/plugins/sudoers/ins_classic.h
// Insults from the original sudo(8).
const ins_classic = [
  'Wrong!  You cheating scum!',
  // #ifndef OFFENSIVE_INSULTS
  'And you call yourself a Rocket Scientist!',
  // #else
  'No soap, honkie-lips.',
  // #endif
  'Where did you learn to type?',
  'Are you on drugs?',
  'My pet ferret can type better than you!',
  'You type like i drive.',
  'Do you think like you type?',
  "Your mind just hasn't been the same since the electro-shock, has it?",
]

// https://github.com/sudo-project/sudo/blob/b0a32fe738af5c20594e2f8320e72f64a83f63c9/plugins/sudoers/ins_csops.h
// CSOps insults (may be site dependent).
const ins_csops = [
  'Maybe if you used more than just two fingers...',
  'BOB says:  You seem to have forgotten your passwd, enter another!',
  'stty: unknown mode: doofus',
  "I can't hear you -- I'm using the scrambler.",
  'The more you drive -- the dumber you get.',
  // #ifdef PC_INSULTS
  "Listen, broccoli brains, I don't have time to listen to this trash.",
  // #else
  "Listen, burrito brains, I don't have time to listen to this trash.",
  // #endif
  "I've seen penguins that can type better than that.",
  'Have you considered trying to match wits with a rutabaga?',
  'You speak an infinite deal of nothing',
]

// https://github.com/sudo-project/sudo/blob/b0a32fe738af5c20594e2f8320e72f64a83f63c9/plugins/sudoers/ins_goons.h
// Insults from the "Goon Show."
const ins_goons = [
  'You silly, twisted boy you.',
  'He has fallen in the water!',
  "We'll all be murdered in our beds!",
  "You can't come in. Our tiger has got flu",
  "I don't wish to know that.",
  'What, what, what, what, what, what, what, what, what, what?',
  "You can't get the wood, you know.",
  "You'll starve!",
  '... and it used to be so popular...',
  'Pauses for audience applause, not a sausage',
  'Hold it up to the light --- not a brain in sight!',
  'Have a gorilla...',
  'There must be cure for it!',
  "There's a lot of it about, you know.",
  'You do that again and see what happens...',
  'Ying Tong Iddle I Po',
  'Harm can come to a young lad like that!',
  'And with that remarks folks, the case of the Crown vs yourself was proven.',
  'Speak English you fool --- there are no subtitles in this scene.',
  'You gotta go owwwww!',
  'I have been called worse.',
  "It's only your word against mine.",
  "I think ... err ... I think ... I think I'll go home",
]

// https://github.com/sudo-project/sudo/blob/b0a32fe738af5c20594e2f8320e72f64a83f63c9/plugins/sudoers/ins_python.h
// Insults from "Monty Python's Flying Circus" and family.
const ins_python = [
  'That is no basis for supreme executive power!',
  'You empty-headed animal food trough wiper!',
  'I fart in your general direction!',
  'Your mother was a hamster and your father smelt of elderberries!',
  'You must cut down the mightiest tree in the forest... with... a herring!',
  'I wave my private parts at your aunties!',
  "He's not the Messiah, he's a very naughty boy!",
  'I wish to make a complaint.',
  "When you're walking home tonight, and some homicidal maniac comes after you with a bunch of loganberries, don't come crying to me!",
  "This man, he doesn't know when he's beaten! He doesn't know when he's winning, either. He has no... sort of... sensory apparatus...",
  "There's nothing wrong with you that an expensive operation can't prolong.",
  "I'm very sorry, but I'm not allowed to argue unless you've paid.",
]

const insults = [
  ...ins_2001,
  ...ins_classic,
  ...ins_csops,
  ...ins_goons,
  ...ins_python,
]

export default defineEventHandler(
  () => insults[Math.floor(Math.random() * insults.length)]
)
