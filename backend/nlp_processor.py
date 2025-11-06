class NLPProcessor:
    def __init__(self):
        print("Note: Running with simplified NLP processor - spacy not installed")
            
    def analyze_question(self, text):
        """Simplified analysis without spacy dependency."""
        return {
            'keywords': ['general'],
            'type': 'coding',
            'difficulty': 'medium',
            'processed_text': text,
            'note': 'Using simplified analysis - spacy not installed'
        }

    def tag_text(self, text):
        """Legacy method for backward compatibility."""
        return ['general']
