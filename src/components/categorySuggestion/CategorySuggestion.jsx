import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";

export default function CategorySuggestion({ name, onSelect }) {
  const [suggestion, setSuggestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const trimmedName = (name || "").trim();
    let isCurrentRequest = true;

    setSuggestion(null);
    setIsLoading(false);
    setHasError(false);

    if (trimmedName.length < 3) {
      setIsLoading(false);
      return () => {
        isCurrentRequest = false;
      };
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          Endpoints.debt.suggestCategory(trimmedName)
        );
        if (isCurrentRequest) {
          setSuggestion(response.data || null);
        }
      } catch {
        if (isCurrentRequest) {
          setHasError(true);
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      isCurrentRequest = false;
      clearTimeout(timeoutId);
    };
  }, [name]);

  return (
    <div className="categorySuggestion" aria-live="polite">
      {isLoading && <Form.Text>Buscando sugestão de categoria...</Form.Text>}
      {hasError && (
        <Form.Text className="categorySuggestionError">
          Não foi possível buscar uma sugestão de categoria.
        </Form.Text>
      )}
      {suggestion && (
        <div className="categorySuggestionResult">
          <span className="categorySuggestionBadge">IA</span>
          <span>
            {suggestion.categoryName} ({Math.round(suggestion.confidence * 100)}%)
          </span>
          <Button
            type="button"
            variant="link"
            className="categorySuggestionAction"
            onClick={() => onSelect(suggestion.categoryId)}
          >
            Usar sugestão
          </Button>
        </div>
      )}
    </div>
  );
}
