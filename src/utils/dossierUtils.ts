export function countCriterionsInDossier(dossier: Dossier): number {
    return dossier.categories.reduce((total, category) => {
      const categoryCriteriaCount = category.descriptions.reduce((descTotal, description) => {
        return descTotal + description.criteria.length;
      }, 0);
      return total + categoryCriteriaCount;
    }, 0);
  }
  