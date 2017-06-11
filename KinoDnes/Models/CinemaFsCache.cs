﻿using System;
using System.Collections.Generic;

namespace KinoDnes.Models
{
    public class CinemaFsCache
    {
        public DateTime ValidUntil { get; set; }
        public DateTime CreatedAt { get; set; }
        public IEnumerable<Cinema> Cinemas { get; set; }
    }
}