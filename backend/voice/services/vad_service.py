"""
Voice Activity Detection (VAD) Service.
Assists in speech boundary detection and silence filtering.
"""

import numpy as np

class VADService:
    @staticmethod
    def is_speech_present(audio_data: np.ndarray, threshold: float = 0.01) -> bool:
        """
        Simple energy-based VAD for audio array.
        """
        if len(audio_data) == 0:
            return False
        energy = np.mean(audio_data ** 2)
        return energy > threshold
