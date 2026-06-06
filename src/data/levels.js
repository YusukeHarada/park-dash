/*
 * Level format:
 *   { id, gridSize, theme, par, animals: [...] }
 * gridSize: 6, 7, or 8
 * orientation: 'H' | 'V'
 * size: 2 | 3
 */
var LEVELS = [
  // ══ 6×6 Levels 1-10 ══════════════════════════════════════════════

  {
    id: 1, gridSize: 6, theme: '牧場', par: 4,
    animals: [
      { id: 'a', orientation: 'H', row: 0, col: 0, size: 2, animal: 'sheep' },
      { id: 'b', orientation: 'V', row: 1, col: 5, size: 2, animal: 'chick' },
      { id: 'c', orientation: 'H', row: 4, col: 0, size: 2, animal: 'pig'   },
      { id: 'd', orientation: 'V', row: 3, col: 4, size: 2, animal: 'duck'  }
    ]
  },

  {
    id: 2, gridSize: 6, theme: '農場', par: 5,
    animals: [
      { id: 'a', orientation: 'H', row: 1, col: 0, size: 3, animal: 'sheep' },
      { id: 'b', orientation: 'V', row: 0, col: 3, size: 2, animal: 'cow'   },
      { id: 'c', orientation: 'H', row: 4, col: 2, size: 2, animal: 'pig'   },
      { id: 'd', orientation: 'H', row: 5, col: 0, size: 2, animal: 'duck'  },
      { id: 'e', orientation: 'H', row: 5, col: 4, size: 2, animal: 'rabbit'}
    ]
  },

  {
    id: 3, gridSize: 6, theme: 'ペット', par: 6,
    animals: [
      { id: 'a', orientation: 'H', row: 1, col: 0, size: 3, animal: 'sheep'  },
      { id: 'b', orientation: 'V', row: 0, col: 3, size: 2, animal: 'cow'    },
      { id: 'c', orientation: 'H', row: 4, col: 0, size: 2, animal: 'pig'    },
      { id: 'd', orientation: 'V', row: 3, col: 2, size: 2, animal: 'rabbit' },
      { id: 'e', orientation: 'H', row: 2, col: 4, size: 2, animal: 'chick'  },
      { id: 'f', orientation: 'H', row: 5, col: 2, size: 2, animal: 'duck'   }
    ]
  },

  {
    id: 4, gridSize: 6, theme: 'ミックス', par: 7,
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

  {
    id: 5, gridSize: 6, theme: '大混雑', par: 9,
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

  {
    id: 6, gridSize: 6, theme: '農場ミックス', par: 10,
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

  {
    id: 7, gridSize: 6, theme: 'ペットミックス', par: 12,
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

  {
    id: 8, gridSize: 6, theme: '激混み', par: 14,
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

  {
    id: 9, gridSize: 6, theme: '密集', par: 18,
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

  {
    id: 10, gridSize: 6, theme: 'カオス', par: 22,
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
  },

  // ══ 7×7 Levels 11-15 ══════════════════════════════════════════════

  {
    id: 11, gridSize: 7, theme: '大草原', par: 8,
    // 7x7 intro — most animals can exit freely
    //   0 1 2 3 4 5 6
    // 0 . a a . b . .
    // 1 . . . . b . c
    // 2 . . . . . . c
    // 3 d d . e . . .
    // 4 . . . e f f .
    // 5 . g . . . . .
    // 6 . g . h h . .
    animals: [
      { id: 'a', orientation: 'H', row: 0, col: 1, size: 2, animal: 'sheep'  },
      { id: 'b', orientation: 'V', row: 0, col: 4, size: 2, animal: 'cow'    },
      { id: 'c', orientation: 'V', row: 1, col: 6, size: 2, animal: 'chick'  },
      { id: 'd', orientation: 'H', row: 3, col: 0, size: 2, animal: 'pig'    },
      { id: 'e', orientation: 'V', row: 3, col: 3, size: 2, animal: 'rabbit' },
      { id: 'f', orientation: 'H', row: 4, col: 4, size: 2, animal: 'duck'   },
      { id: 'g', orientation: 'V', row: 5, col: 1, size: 2, animal: 'cat'    },
      { id: 'h', orientation: 'H', row: 6, col: 3, size: 2, animal: 'dog'    }
    ]
  },

  {
    id: 12, gridSize: 7, theme: '田舎道', par: 10,
    //   0 1 2 3 4 5 6
    // 0 . a a . b b .
    // 1 . . . . . . c
    // 2 . . d . . . c
    // 3 e e d . . . .
    // 4 . . . . f . .
    // 5 . . . . f g g
    // 6 h h . . . . .
    animals: [
      { id: 'a', orientation: 'H', row: 0, col: 1, size: 2, animal: 'sheep'  },
      { id: 'b', orientation: 'H', row: 0, col: 4, size: 2, animal: 'cow'    },
      { id: 'c', orientation: 'V', row: 1, col: 6, size: 2, animal: 'chick'  },
      { id: 'd', orientation: 'V', row: 2, col: 2, size: 2, animal: 'pig'    },
      { id: 'e', orientation: 'H', row: 3, col: 0, size: 2, animal: 'rabbit' },
      { id: 'f', orientation: 'V', row: 4, col: 4, size: 2, animal: 'duck'   },
      { id: 'g', orientation: 'H', row: 5, col: 5, size: 2, animal: 'cat'    },
      { id: 'h', orientation: 'H', row: 6, col: 0, size: 2, animal: 'dog'    }
    ]
  },

  {
    id: 13, gridSize: 7, theme: 'にぎやか', par: 13,
    //   0 1 2 3 4 5 6
    // 0 a a b . . . .
    // 1 . . b . c . .
    // 2 . . . . c d d
    // 3 e . . . . . .
    // 4 e f f . . . g
    // 5 . . . . h . g
    // 6 . . . . h . .
    animals: [
      { id: 'a', orientation: 'H', row: 0, col: 0, size: 2, animal: 'sheep'  },
      { id: 'b', orientation: 'V', row: 0, col: 2, size: 2, animal: 'cow'    },
      { id: 'c', orientation: 'V', row: 1, col: 4, size: 2, animal: 'chick'  },
      { id: 'd', orientation: 'H', row: 2, col: 5, size: 2, animal: 'pig'    },
      { id: 'e', orientation: 'V', row: 3, col: 0, size: 2, animal: 'rabbit' },
      { id: 'f', orientation: 'H', row: 4, col: 1, size: 2, animal: 'duck'   },
      { id: 'g', orientation: 'V', row: 4, col: 6, size: 2, animal: 'cat'    },
      { id: 'h', orientation: 'V', row: 5, col: 4, size: 2, animal: 'dog'    }
    ]
  },

  {
    id: 14, gridSize: 7, theme: '混み合い', par: 15,
    //   0 1 2 3 4 5 6
    // 0 . a a . . b .
    // 1 . . . c . b .
    // 2 . . . c . . .
    // 3 d d . . e . .
    // 4 . . f . e . .
    // 5 . . f g g . .
    // 6 h h . . . i i
    animals: [
      { id: 'a', orientation: 'H', row: 0, col: 1, size: 2, animal: 'sheep'  },
      { id: 'b', orientation: 'V', row: 0, col: 5, size: 2, animal: 'cow'    },
      { id: 'c', orientation: 'V', row: 1, col: 3, size: 2, animal: 'chick'  },
      { id: 'd', orientation: 'H', row: 3, col: 0, size: 2, animal: 'pig'    },
      { id: 'e', orientation: 'V', row: 3, col: 4, size: 2, animal: 'rabbit' },
      { id: 'f', orientation: 'V', row: 4, col: 2, size: 2, animal: 'duck'   },
      { id: 'g', orientation: 'H', row: 5, col: 3, size: 2, animal: 'cat'    },
      { id: 'h', orientation: 'H', row: 6, col: 0, size: 2, animal: 'dog'    },
      { id: 'i', orientation: 'H', row: 6, col: 5, size: 2, animal: 'sheep'  }
    ]
  },

  {
    id: 15, gridSize: 7, theme: '大混乱', par: 18,
    //   0 1 2 3 4 5 6
    // 0 a a . b . c c
    // 1 . . . b . . .
    // 2 d . . . e . .
    // 3 d . f . e . .
    // 4 . . f . . g .
    // 5 h h . . . g .
    // 6 . . i i . . .
    animals: [
      { id: 'a', orientation: 'H', row: 0, col: 0, size: 2, animal: 'sheep'  },
      { id: 'b', orientation: 'V', row: 0, col: 3, size: 2, animal: 'cow'    },
      { id: 'c', orientation: 'H', row: 0, col: 5, size: 2, animal: 'chick'  },
      { id: 'd', orientation: 'V', row: 2, col: 0, size: 2, animal: 'pig'    },
      { id: 'e', orientation: 'V', row: 2, col: 4, size: 2, animal: 'rabbit' },
      { id: 'f', orientation: 'V', row: 3, col: 2, size: 2, animal: 'duck'   },
      { id: 'g', orientation: 'V', row: 4, col: 5, size: 2, animal: 'cat'    },
      { id: 'h', orientation: 'H', row: 5, col: 0, size: 2, animal: 'dog'    },
      { id: 'i', orientation: 'H', row: 6, col: 2, size: 2, animal: 'sheep'  }
    ]
  },

  // ══ 8×8 Levels 16-20 ══════════════════════════════════════════════

  {
    id: 16, gridSize: 8, theme: '大牧場', par: 10,
    //   0 1 2 3 4 5 6 7
    // 0 a a . . b . . .
    // 1 . . . . b . c .
    // 2 . . . . . . c .
    // 3 d d . . . . . .
    // 4 . . e . . f f .
    // 5 . . e . . . . .
    // 6 . g . . . . h h
    // 7 . g . i i . . .
    animals: [
      { id: 'a', orientation: 'H', row: 0, col: 0, size: 2, animal: 'sheep'  },
      { id: 'b', orientation: 'V', row: 0, col: 4, size: 2, animal: 'cow'    },
      { id: 'c', orientation: 'V', row: 1, col: 6, size: 2, animal: 'chick'  },
      { id: 'd', orientation: 'H', row: 3, col: 0, size: 2, animal: 'pig'    },
      { id: 'e', orientation: 'V', row: 4, col: 2, size: 2, animal: 'rabbit' },
      { id: 'f', orientation: 'H', row: 4, col: 5, size: 2, animal: 'duck'   },
      { id: 'g', orientation: 'V', row: 6, col: 1, size: 2, animal: 'cat'    },
      { id: 'h', orientation: 'H', row: 6, col: 6, size: 2, animal: 'dog'    },
      { id: 'i', orientation: 'H', row: 7, col: 3, size: 2, animal: 'sheep'  }
    ]
  },

  {
    id: 17, gridSize: 8, theme: '広野', par: 13,
    //   0 1 2 3 4 5 6 7
    // 0 . a a . . b b .
    // 1 . . . . . . . c
    // 2 d . . . e . . c
    // 3 d . f f e . . .
    // 4 . . . . . g . .
    // 5 h h . . . g . .
    // 6 . . . i . . . .
    // 7 . . . i j j . .
    animals: [
      { id: 'a', orientation: 'H', row: 0, col: 1, size: 2, animal: 'sheep'  },
      { id: 'b', orientation: 'H', row: 0, col: 5, size: 2, animal: 'cow'    },
      { id: 'c', orientation: 'V', row: 1, col: 7, size: 2, animal: 'chick'  },
      { id: 'd', orientation: 'V', row: 2, col: 0, size: 2, animal: 'pig'    },
      { id: 'e', orientation: 'V', row: 2, col: 4, size: 2, animal: 'rabbit' },
      { id: 'f', orientation: 'H', row: 3, col: 2, size: 2, animal: 'duck'   },
      { id: 'g', orientation: 'V', row: 4, col: 5, size: 2, animal: 'cat'    },
      { id: 'h', orientation: 'H', row: 5, col: 0, size: 2, animal: 'dog'    },
      { id: 'i', orientation: 'V', row: 6, col: 3, size: 2, animal: 'sheep'  },
      { id: 'j', orientation: 'H', row: 7, col: 4, size: 2, animal: 'cow'    }
    ]
  },

  {
    id: 18, gridSize: 8, theme: '大農場', par: 16,
    //   0 1 2 3 4 5 6 7
    // 0 a a b . . c . .
    // 1 . . b . . c d d
    // 2 e . . . . . . .
    // 3 e f . . g . . .
    // 4 . f . . g h h .
    // 5 . . i . . . . .
    // 6 j j i . . k . .
    // 7 . . . . . k l l
    animals: [
      { id: 'a', orientation: 'H', row: 0, col: 0, size: 2, animal: 'sheep'  },
      { id: 'b', orientation: 'V', row: 0, col: 2, size: 2, animal: 'cow'    },
      { id: 'c', orientation: 'V', row: 0, col: 5, size: 2, animal: 'chick'  },
      { id: 'd', orientation: 'H', row: 1, col: 6, size: 2, animal: 'pig'    },
      { id: 'e', orientation: 'V', row: 2, col: 0, size: 2, animal: 'rabbit' },
      { id: 'f', orientation: 'V', row: 3, col: 1, size: 2, animal: 'duck'   },
      { id: 'g', orientation: 'V', row: 3, col: 4, size: 2, animal: 'cat'    },
      { id: 'h', orientation: 'H', row: 4, col: 5, size: 2, animal: 'dog'    },
      { id: 'i', orientation: 'V', row: 5, col: 2, size: 2, animal: 'sheep'  },
      { id: 'j', orientation: 'H', row: 6, col: 0, size: 2, animal: 'cow'    },
      { id: 'k', orientation: 'V', row: 6, col: 5, size: 2, animal: 'chick'  },
      { id: 'l', orientation: 'H', row: 7, col: 6, size: 2, animal: 'pig'    }
    ]
  },

  {
    id: 19, gridSize: 8, theme: '超密集', par: 20,
    //   0 1 2 3 4 5 6 7
    // 0 a a . b b . c c
    // 1 . . . . . d . .
    // 2 . e . . . d . f
    // 3 . e g . . . . f
    // 4 h . g . i i . .
    // 5 h . . . . . j .
    // 6 . k k . . . j .
    // 7 . . . l l . . .
    animals: [
      { id: 'a', orientation: 'H', row: 0, col: 0, size: 2, animal: 'sheep'  },
      { id: 'b', orientation: 'H', row: 0, col: 3, size: 2, animal: 'cow'    },
      { id: 'c', orientation: 'H', row: 0, col: 6, size: 2, animal: 'chick'  },
      { id: 'd', orientation: 'V', row: 1, col: 5, size: 2, animal: 'pig'    },
      { id: 'e', orientation: 'V', row: 2, col: 1, size: 2, animal: 'rabbit' },
      { id: 'f', orientation: 'V', row: 2, col: 7, size: 2, animal: 'duck'   },
      { id: 'g', orientation: 'V', row: 3, col: 2, size: 2, animal: 'cat'    },
      { id: 'h', orientation: 'V', row: 4, col: 0, size: 2, animal: 'dog'    },
      { id: 'i', orientation: 'H', row: 4, col: 4, size: 2, animal: 'sheep'  },
      { id: 'j', orientation: 'V', row: 5, col: 6, size: 2, animal: 'cow'    },
      { id: 'k', orientation: 'H', row: 6, col: 1, size: 2, animal: 'chick'  },
      { id: 'l', orientation: 'H', row: 7, col: 3, size: 2, animal: 'pig'    }
    ]
  },

  {
    id: 20, gridSize: 8, theme: 'カオス級', par: 25,
    //   0 1 2 3 4 5 6 7
    // 0 a a b . c . d d
    // 1 . . b . c e . .
    // 2 f . . . . e . g
    // 3 f h . . . . . g
    // 4 . h i i . . j .
    // 5 k . . . l . j .
    // 6 k . m . l n . .
    // 7 . . m o o n . .
    animals: [
      { id: 'a', orientation: 'H', row: 0, col: 0, size: 2, animal: 'sheep'  },
      { id: 'b', orientation: 'V', row: 0, col: 2, size: 2, animal: 'cow'    },
      { id: 'c', orientation: 'V', row: 0, col: 4, size: 2, animal: 'chick'  },
      { id: 'd', orientation: 'H', row: 0, col: 6, size: 2, animal: 'pig'    },
      { id: 'e', orientation: 'V', row: 1, col: 5, size: 2, animal: 'rabbit' },
      { id: 'f', orientation: 'V', row: 2, col: 0, size: 2, animal: 'duck'   },
      { id: 'g', orientation: 'V', row: 2, col: 7, size: 2, animal: 'cat'    },
      { id: 'h', orientation: 'V', row: 3, col: 1, size: 2, animal: 'dog'    },
      { id: 'i', orientation: 'H', row: 4, col: 2, size: 2, animal: 'sheep'  },
      { id: 'j', orientation: 'V', row: 4, col: 6, size: 2, animal: 'cow'    },
      { id: 'k', orientation: 'V', row: 5, col: 0, size: 2, animal: 'chick'  },
      { id: 'l', orientation: 'V', row: 5, col: 4, size: 2, animal: 'pig'    },
      { id: 'm', orientation: 'V', row: 6, col: 2, size: 2, animal: 'rabbit' },
      { id: 'n', orientation: 'V', row: 6, col: 5, size: 2, animal: 'duck'   },
      { id: 'o', orientation: 'H', row: 7, col: 3, size: 2, animal: 'cat'    }
    ]
  }
];
