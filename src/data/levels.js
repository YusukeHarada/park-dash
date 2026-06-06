/*
 * Level format:
 *   { id, theme, par, animals: [{ id, orientation:'H'|'V', row, col, size:2|3, animal }] }
 *
 * Grid: 6x6 (rows 0-5, cols 0-5)
 * Auto-slide: each move slides animal to max valid position (wall or blocker)
 * par = minimum moves for 3-star rating
 *
 * To trace: lower-left origin, row increases downward, col increases rightward.
 */
var LEVELS = [
  // ── Level 1: Tutorial ──────────────────────────────────────────
  // All animals can exit in 1 auto-slide. Learn the controls.
  //   0 1 2 3 4 5
  // 0 a a . . . .
  // 1 . . . . . b
  // 2 . . . . . b
  // 3 . . . . d .
  // 4 c c . . d .
  // 5 . . . . . .
  {
    id: 1, theme: '牧場', par: 4,
    animals: [
      { id: 'a', orientation: 'H', row: 0, col: 0, size: 2, animal: 'sheep' },
      { id: 'b', orientation: 'V', row: 1, col: 5, size: 2, animal: 'chick' },
      { id: 'c', orientation: 'H', row: 4, col: 0, size: 2, animal: 'pig'   },
      { id: 'd', orientation: 'V', row: 3, col: 4, size: 2, animal: 'duck'  }
    ]
  },

  // ── Level 2: First Chain ────────────────────────────────────────
  // b blocks a. Move b (up) → a can exit right.
  //   0 1 2 3 4 5
  // 0 . . . b . .
  // 1 a a a b . .
  // 2 . . . . . .
  // 3 . . . . . .
  // 4 . . c c . .
  // 5 d d . . e e
  {
    id: 2, theme: '農場', par: 5,
    animals: [
      { id: 'a', orientation: 'H', row: 1, col: 0, size: 3, animal: 'sheep' },
      { id: 'b', orientation: 'V', row: 0, col: 3, size: 2, animal: 'cow'   },
      { id: 'c', orientation: 'H', row: 4, col: 2, size: 2, animal: 'pig'   },
      { id: 'd', orientation: 'H', row: 5, col: 0, size: 2, animal: 'duck'  },
      { id: 'e', orientation: 'H', row: 5, col: 4, size: 2, animal: 'rabbit'}
    ]
  },

  // ── Level 3: Two Independent Chains ────────────────────────────
  // Chain1: b→a  Chain2: d→c  Free: e, f
  //   0 1 2 3 4 5
  // 0 . . . b . .
  // 1 a a a b . .
  // 2 . . . . e e
  // 3 . . d . . .
  // 4 c c d . . .
  // 5 . . f f . .
  {
    id: 3, theme: 'ペット', par: 6,
    animals: [
      { id: 'a', orientation: 'H', row: 1, col: 0, size: 3, animal: 'sheep'  },
      { id: 'b', orientation: 'V', row: 0, col: 3, size: 2, animal: 'cow'    },
      { id: 'c', orientation: 'H', row: 4, col: 0, size: 2, animal: 'pig'    },
      { id: 'd', orientation: 'V', row: 3, col: 2, size: 2, animal: 'rabbit' },
      { id: 'e', orientation: 'H', row: 2, col: 4, size: 2, animal: 'chick'  },
      { id: 'f', orientation: 'H', row: 5, col: 2, size: 2, animal: 'duck'   }
    ]
  },

  // ── Level 4: Shared Blocker ─────────────────────────────────────
  // x (V) blocks both a (row1) and c (row2).
  // x is pinched between y (above, row0) and z (below, row3).
  // Move y OR z first → x exits → a and c exit. Plus f, g free.
  //   0 1 2 3 4 5
  // 0 . . . y y .
  // 1 a a a x . .
  // 2 c c . x . .
  // 3 . . . z z .
  // 4 f f . . . .
  // 5 . . g g . .
  {
    id: 4, theme: 'ミックス', par: 7,
    animals: [
      { id: 'a', orientation: 'H', row: 1, col: 0, size: 3, animal: 'sheep'  },
      { id: 'c', orientation: 'H', row: 2, col: 0, size: 2, animal: 'pig'    },
      { id: 'x', orientation: 'V', row: 1, col: 3, size: 2, animal: 'cow'    },
      { id: 'y', orientation: 'H', row: 0, col: 3, size: 2, animal: 'chick'  },
      { id: 'z', orientation: 'H', row: 3, col: 3, size: 2, animal: 'duck'   },
      { id: 'f', orientation: 'H', row: 4, col: 0, size: 2, animal: 'rabbit' },
      { id: 'g', orientation: 'H', row: 5, col: 2, size: 2, animal: 'cat'    }
    ]
  },

  // ── Level 5: 4-Step Chain ───────────────────────────────────────
  // 4-step chain: z exits → y can exit → x can exit → a can exit.
  // Plus 2-step chain: q→p. Plus 1 free (f).
  //   0 1 2 3 4 5
  // 0 . . . . . z
  // 1 . . . y y z   (z:V rows0-1 col5; y:H row1 cols3-4)
  // 2 . . . x . .
  // 3 a a a x . .
  // 4 . . q . . .
  // 5 p p q f f .
  {
    id: 5, theme: '大混雑', par: 9,
    animals: [
      { id: 'a', orientation: 'H', row: 3, col: 0, size: 3, animal: 'sheep'  },
      { id: 'x', orientation: 'V', row: 2, col: 3, size: 2, animal: 'cow'    },
      { id: 'y', orientation: 'H', row: 1, col: 3, size: 2, animal: 'rabbit' },
      { id: 'z', orientation: 'V', row: 0, col: 5, size: 2, animal: 'chick'  },
      { id: 'p', orientation: 'H', row: 5, col: 0, size: 2, animal: 'pig'    },
      { id: 'q', orientation: 'V', row: 4, col: 2, size: 2, animal: 'duck'   },
      { id: 'f', orientation: 'H', row: 5, col: 3, size: 2, animal: 'cat'    }
    ]
  },

  // ── Level 6: Dense Farm ─────────────────────────────────────────
  //   0 1 2 3 4 5
  // 0 a a . b . .
  // 1 . . . b c c
  // 2 . d . . . c   (c: V rows1-2 col5)
  // 3 . d e e . .
  // 4 . . . f f .
  // 5 g g . . h h
  {
    id: 6, theme: '農場ミックス', par: 10,
    animals: [
      { id: 'a', orientation: 'H', row: 0, col: 0, size: 2, animal: 'sheep'  },
      { id: 'b', orientation: 'V', row: 0, col: 3, size: 2, animal: 'cow'    },
      { id: 'c', orientation: 'V', row: 1, col: 5, size: 2, animal: 'chick'  },
      { id: 'd', orientation: 'V', row: 2, col: 1, size: 2, animal: 'pig'    },
      { id: 'e', orientation: 'H', row: 3, col: 2, size: 2, animal: 'rabbit' },
      { id: 'f', orientation: 'H', row: 4, col: 3, size: 2, animal: 'duck'   },
      { id: 'g', orientation: 'H', row: 5, col: 0, size: 2, animal: 'cat'    },
      { id: 'h', orientation: 'H', row: 5, col: 4, size: 2, animal: 'dog'    }
    ]
  },

  // ── Level 7: Cross Block ────────────────────────────────────────
  //   0 1 2 3 4 5
  // 0 . . p . . .
  // 1 a a p . b .
  // 2 . . . . b .
  // 3 c c c . . .
  // 4 . . d d . e
  // 5 . f f . . e
  {
    id: 7, theme: 'ペットミックス', par: 12,
    animals: [
      { id: 'a', orientation: 'H', row: 1, col: 0, size: 2, animal: 'sheep'  },
      { id: 'b', orientation: 'V', row: 1, col: 4, size: 2, animal: 'chick'  },
      { id: 'c', orientation: 'H', row: 3, col: 0, size: 3, animal: 'pig'    },
      { id: 'd', orientation: 'H', row: 4, col: 2, size: 2, animal: 'rabbit' },
      { id: 'e', orientation: 'V', row: 4, col: 5, size: 2, animal: 'duck'   },
      { id: 'f', orientation: 'H', row: 5, col: 1, size: 2, animal: 'cat'    },
      { id: 'p', orientation: 'V', row: 0, col: 2, size: 2, animal: 'cow'    },
      { id: 'q', orientation: 'H', row: 0, col: 3, size: 2, animal: 'dog'    },
      { id: 'r', orientation: 'H', row: 2, col: 1, size: 2, animal: 'sheep'  }
    ]
  },

  // ── Level 8: Dense Grid ─────────────────────────────────────────
  //   0 1 2 3 4 5
  // 0 a a . b b .
  // 1 . . . . c .
  // 2 d . . . c .
  // 3 d e e . . f
  // 4 . . . g g f
  // 5 h h . . i i
  {
    id: 8, theme: '大混雑', par: 14,
    animals: [
      { id: 'a', orientation: 'H', row: 0, col: 0, size: 2, animal: 'sheep'  },
      { id: 'b', orientation: 'H', row: 0, col: 3, size: 2, animal: 'cow'    },
      { id: 'c', orientation: 'V', row: 1, col: 4, size: 2, animal: 'chick'  },
      { id: 'd', orientation: 'V', row: 2, col: 0, size: 2, animal: 'pig'    },
      { id: 'e', orientation: 'H', row: 3, col: 1, size: 2, animal: 'rabbit' },
      { id: 'f', orientation: 'V', row: 3, col: 5, size: 2, animal: 'duck'   },
      { id: 'g', orientation: 'H', row: 4, col: 3, size: 2, animal: 'cat'    },
      { id: 'h', orientation: 'H', row: 5, col: 0, size: 2, animal: 'dog'    },
      { id: 'i', orientation: 'H', row: 5, col: 4, size: 2, animal: 'sheep'  }
    ]
  },

  // ── Level 9: Expert ─────────────────────────────────────────────
  //   0 1 2 3 4 5
  // 0 a a b b . .
  // 1 . . . . c c
  // 2 d . . . . c
  // 3 d e . f . .
  // 4 . e g f . .
  // 5 h h g . i i
  {
    id: 9, theme: '密集', par: 18,
    animals: [
      { id: 'a', orientation: 'H', row: 0, col: 0, size: 2, animal: 'sheep'  },
      { id: 'b', orientation: 'H', row: 0, col: 2, size: 2, animal: 'cow'    },
      { id: 'c', orientation: 'V', row: 1, col: 5, size: 2, animal: 'chick'  },
      { id: 'd', orientation: 'V', row: 2, col: 0, size: 2, animal: 'pig'    },
      { id: 'e', orientation: 'V', row: 3, col: 1, size: 2, animal: 'rabbit' },
      { id: 'f', orientation: 'V', row: 3, col: 3, size: 2, animal: 'duck'   },
      { id: 'g', orientation: 'V', row: 4, col: 2, size: 2, animal: 'cat'    },
      { id: 'h', orientation: 'H', row: 5, col: 0, size: 2, animal: 'dog'    },
      { id: 'i', orientation: 'H', row: 5, col: 4, size: 2, animal: 'sheep'  },
      { id: 'j', orientation: 'H', row: 2, col: 2, size: 2, animal: 'cow'    }
    ]
  },

  // ── Level 10: Master ────────────────────────────────────────────
  //   0 1 2 3 4 5
  // 0 a a b . c c
  // 1 . . b d . .
  // 2 e . . d . f
  // 3 e g g . . f
  // 4 . . . h h .
  // 5 i i . . j j
  // + k somewhere
  {
    id: 10, theme: 'カオス', par: 22,
    animals: [
      { id: 'a', orientation: 'H', row: 0, col: 0, size: 2, animal: 'sheep'  },
      { id: 'b', orientation: 'V', row: 0, col: 2, size: 2, animal: 'cow'    },
      { id: 'c', orientation: 'H', row: 0, col: 4, size: 2, animal: 'chick'  },
      { id: 'd', orientation: 'V', row: 1, col: 3, size: 2, animal: 'pig'    },
      { id: 'e', orientation: 'V', row: 2, col: 0, size: 2, animal: 'rabbit' },
      { id: 'f', orientation: 'V', row: 2, col: 5, size: 2, animal: 'duck'   },
      { id: 'g', orientation: 'H', row: 3, col: 1, size: 2, animal: 'cat'    },
      { id: 'h', orientation: 'H', row: 4, col: 3, size: 2, animal: 'dog'    },
      { id: 'i', orientation: 'H', row: 5, col: 0, size: 2, animal: 'sheep'  },
      { id: 'j', orientation: 'H', row: 5, col: 4, size: 2, animal: 'cow'    },
      { id: 'k', orientation: 'H', row: 3, col: 3, size: 2, animal: 'chick'  }
    ]
  }
];
