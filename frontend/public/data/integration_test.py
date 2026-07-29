from src.knowledge_base import KnowledgeBase
kb = KnowledgeBase()

d = kb.get_domain('web_frontend')
assert d is not None, 'web_frontend not found'
assert 'React' in str(d.get('frameworks', [])), 'React not found'
print(f'Domain test OK: {d["name"]}')

ci = kb.get_country_industry_detail('Singapore')
assert ci is not None
assert len(ci.get('industry_detail', [])) >= 3
print(f'Country industry test OK: Singapore has {len(ci["industry_detail"])} industries')

lvl = kb.get_agi_level(5)
assert lvl is not None
assert 'AGI' in lvl['name']
print(f'AGI level test OK: {lvl["name"]}')

assert len(kb.asi_theories) == 9
print(f'ASI theories test OK: {len(kb.asi_theories)} theories')

results = kb.search('machine learning')
domain_results = [r for r in results if r['type'] == 'domain']
assert len(domain_results) > 0
print(f'Domain search test OK: found {len(domain_results)} domain results')

assert len(kb.agi_orgs) >= 10
print(f'AGI orgs test OK: {len(kb.agi_orgs)} organizations')

print()
print('ALL INTEGRATION TESTS PASSED')
