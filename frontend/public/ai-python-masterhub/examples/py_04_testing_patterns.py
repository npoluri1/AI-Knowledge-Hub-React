"""Run with:  pytest py_04_testing_patterns.py -q"""
import pytest

# --- code under test ---
def discount(price: float, pct: float) -> float:
    if price < 0:      raise ValueError("negative price")
    if not 0 <= pct <= 90: raise ValueError("pct out of range")
    return round(price * (1 - pct / 100), 2)

class PaymentGateway:                       # external dependency (fake)
    def charge(self, cents: int) -> bool: raise RuntimeError("network!")

def checkout(gw: PaymentGateway, price: float) -> bool:
    # float trap: int(19.99*100) == 1998!  always round before int()
    return gw.charge(int(round(price * 100)))

# --- tests ---
@pytest.mark.parametrize("price,pct,expected", [
    (100, 10, 90.0), (199.99, 50, 100.0), (80, 0, 80.0),
])
def test_discount_happy(price, pct, expected):
    assert discount(price, pct) == expected

@pytest.mark.parametrize("price,pct", [(-1, 10), (100, 95), (100, -5)])
def test_discount_rejects(price, pct):
    with pytest.raises(ValueError):
        discount(price, pct)

@pytest.fixture
def gateway(monkeypatch):
    gw = PaymentGateway()
    calls = []
    monkeypatch.setattr(gw, "charge", lambda cents: calls.append(cents) or True)
    gw.calls = calls
    return gw

def test_checkout_calls_gateway(gateway):
    assert checkout(gateway, 19.99) is True
    assert gateway.calls == [1999]

# --- poor-man property test (use Hypothesis in real projects) ---
def test_discount_never_increases():
    import random
    for _ in range(200):
        p, d = random.uniform(1, 5000), random.uniform(0, 90)
        assert discount(p, d) <= round(p, 2)